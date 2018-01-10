/**
 * @function is a [HOC] that takes the wrapped component along with its
 * config options to decorate a new component containing the new props
 */
import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import hoistNonReactStatic from "hoist-non-react-statics";

import { Throwable } from "./helpers/throwable";
import { GeneralBasedUtils } from "../../utils";
import XMLHttp from "./httpRequest";
import DefiniteProgressBar from "./DefiniteProgressBar";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

const composer = (method, { props, name, options, skip }) => {
  function decorateClass(WrappedComponent) {
    return connect(state => ({
      progressState: state.dataLoadProgress,
      routeDatas: state.routeDatas,
      queryDatas: state.queryDatas
    }))(
      class Composer extends React.PureComponent {
        constructor(props, context) {
          super(props, context);

          Throwable.initThrowable(method, { name, options, props });

          let initialDataSettings =
            method.toUpperCase() === "GET" || method.toUpperCase() === "CONNECT"
              ? { isInitialDataSet: false, loading: true }
              : {};
          this.state = {
            [`${name}`]: { ...initialDataSettings }
          };
        }

        static displayName = `Composer(${getDisplayName(WrappedComponent)}`;

        componentDidMount() {
          if (
            method.toUpperCase() === "GET" ||
            method.toUpperCase() === "CONNECT"
          ) {
            let fetchPolicy =
              typeof options === "function"
                ? options(this.props).fetchPolicy
                : options.fetchPolicy || "cache-first";

            switch (fetchPolicy) {
              case "network-only":
                this.refetchQuery(undefined);
                break;
              case "cache-only":
                this.setInitialStateAfterMount();
                break;
              case "cache-and-network":
                this.setInitialStateAfterMount();
                this.refetchQuery(undefined);
                break;
              default:
                let { location: { pathname, hash, search } } = this.props,
                  url = `${pathname}${search}${hash}`;
                if (this.props.queryDatas[name] || this.props.routeDatas[url]) {
                  this.setInitialStateAfterMount();
                } else {
                  this.refetchQuery(undefined);
                }
                break;
            }
          }
        }

        componentWillReceiveProps(nextProps) {
          let { location: { pathname, hash, search } } = this.props,
            url = `${pathname}${search}${hash}`,
            nextPropsComparismData =
              method.toUpperCase() === "GET"
                ? nextProps.queryDatas[name]
                : nextProps.routeDatas[url];

          if (
            nextPropsComparismData &&
            (method.toUpperCase() === "CONNECT" ||
              method.toUpperCase() === "GET")
          ) {
            if (
              !_.isEqual(nextPropsComparismData, this.state[`${name}`].result)
            ) {
              this.setState({
                [`${name}`]: {
                  ...this.state[`${name}`],
                  loading: false,
                  isInitialDataSet: true,
                  result: nextPropsComparismData
                }
              });
            }
          }
        }

        setInitialStateAfterMount = () => {
          let { location: { pathname, hash, search } } = this.props,
            url = `${pathname}${search}${hash}`;
          this.setState({
            [`${name}`]: {
              ...this.state[`${name}`],
              loading: false,
              isInitialDataSet: true,
              result:
                method.toUpperCase() === "GET"
                  ? this.props.queryDatas[name]
                  : this.props.routeDatas[url]
            }
          });
        };

        setLoadingDataState = () => {
          this.setState({
            [`${name}`]: {
              ...this.state[`${name}`],
              loading: true
            }
          });
        };

        setSuccessDataState = (data, CB) => {
          let initialDataSettings = {};
          if (method.toUpperCase() === "GET") {
            initialDataSettings = { isInitialDataSet: true };
            this.props.route.setQueryDatas(name, data);
          } else if (method.toUpperCase() === "CONNECT") {
            initialDataSettings = { isInitialDataSet: true };
            let { location: { pathname, search, hash } } = this.props,
              url = `${pathname}${search}${hash}`;
            this.props.route.setRouteDatas(url, data);
          }
          this.setState(
            {
              [`${name}`]: {
                ...this.state[`${name}`],
                error: undefined,
                ...initialDataSettings,
                loading: false,
                result: data
              }
            },
            () => CB && CB()
          );
        };

        setErrorDataState = error => {
          this.setState({
            [`${name}`]: {
              ...this.state[`${name}`],
              loading: false,
              error
            }
          });
        };

        getHttpParams = config => {
          let params = undefined;
          if (config && config.variables) {
            params = config.variables;
          } else {
            params =
              typeof options === "function"
                ? options(this.props).variables
                : options.variables;
          }
          return params;
        };

        refetchQuery = config => {
          let skipping =
            typeof skip === "boolean"
              ? skip
              : typeof skip === "function" ? skip(this.props) : false;
          if (!skipping) {
            this.setLoadingDataState();
            let params = this.getHttpParams(config);

            XMLHttp("GET", params)
              .then(data => {
                this.setSuccessDataState(data);
              })
              .catch(error => {
                this.setErrorDataState(error);
              });
          }
        };

        refetchQueries = arrayOfVariables => {
          arrayOfVariables.forEach(variables => {
            XMLHttp("GET", variables)
              .then(data => {
                this.props.route.setQueryDatas(variables.name, data);
              })
              .catch(error => {
                //could be killed in the future, since queries could be fetched any part of the API and an error thrown
                //here is insignificant
                console.warn(error);
              });
          });
        };

        mutate = variablesConfig => {
          let params = this.getHttpParams(variablesConfig);

          this.setLoadingDataState();
          return XMLHttp(method, params)
            .then(data => {
              this.setState({
                [`${name}`]: {
                  ...this.state[`${name}`],
                  loading: false
                }
              });
              typeof options === "function"
                ? options(this.props).refetchQueries &&
                  this.refetchQueries(options(this.props).refetchQueries)
                : options &&
                  options.refetchQueries &&
                  this.refetchQueries(options.refetchQueries);
              return data;
            })
            .catch(error => {
              this.setState({
                [`${name}`]: {
                  ...this.state[`${name}`],
                  loading: false
                }
              });
              return Promise.reject(error);
            });
        };

        fetchMore = config => {
          let skipping =
            typeof skip === "boolean"
              ? skip
              : typeof skip === "function" ? skip(this.props) : false;
          if (!skipping) {
            if (config.updateQuery) {
              let variablesConfig = this.getHttpParams(config);

              this.setLoadingDataState();
              XMLHttp("GET", variablesConfig)
                .then(data => {
                  let newResult = config.updateQuery(
                      this.state[`${name}`].result,
                      {
                        fetchMoreResult: data
                      }
                    ),
                    { location: { pathname, search, hash } } = this.props,
                    url = `${pathname}${search}${hash}`,
                    operationToRun =
                      method.toUpperCase() === "GET"
                        ? () => this.props.route.setQueryDatas(name, newResult)
                        : () => this.props.route.setRouteDatas(url, newResult);

                  this.setSuccessDataState(newResult, operationToRun);
                })
                .catch(error => this.setErrorDataState(error));
            } else {
              throw new Error("[updateQuery] is needed in [data.fetchMore]");
            }
          }
        };

        calculateProgress = computed =>
          this.props.route.setProgressState(computed * 50);

        push = optionsConfig => {
          let params = this.getHttpParams(optionsConfig);

          this.props.route.computeProgressState(0, 25);

          XMLHttp("GET", params, this.calculateProgress)
            .then(result => {
              this.props.route.setRouteDatas(optionsConfig.goto, result);
              setTimeout(() => {
                setTimeout(
                  () => this.props.route.computeProgressState(50, 100),
                  10
                );
                this.props.history.push(optionsConfig.goto);
              }, 10);
            })
            .catch(err => console.log(err));
        };

        buildProps = (customProps, defaultAdditionalProps) => {
          if (
            typeof customProps === "object" &&
            customProps.length === undefined
          ) {
            return {
              ...GeneralBasedUtils.sanitizeProps(this.props, [
                "progressState",
                "queryDatas",
                "routeDatas"
              ]),
              ...customProps
            };
          }
          return {
            ...GeneralBasedUtils.sanitizeProps(this.props, [
              "progressState",
              "queryDatas",
              "routeDatas"
            ]),
            ...defaultAdditionalProps
          };
        };

        composeCustomProps = sanitizedProps => {
          let customProps =
            props &&
            typeof props === "function" &&
            props({
              [`${name}`]: {
                ...this.state[`${name}`],
                fetchMore: this.fetchMore,
                refetchQuery: this.refetchQuery
              },
              ...sanitizedProps
            });
          return customProps;
        };

        sanitizePassedProps = () => {
          let passedProps = {},
            customProps = [],
            sanitizedProps = GeneralBasedUtils.sanitizeProps(this.props, [
              "progressState",
              "queryDatas",
              "routeDatas",
              "route"
            ]);
          switch (method.toUpperCase()) {
            case "GET":
              passedProps = this.buildProps(
                this.composeCustomProps(sanitizedProps),
                {
                  [`${name}`]: {
                    ...this.state[`${name}`],
                    fetchMore: this.fetchMore,
                    refetchQuery: this.refetchQuery
                  }
                }
              );
              break;
            case "CONNECT":
              passedProps = this.buildProps(
                this.composeCustomProps(sanitizedProps),
                {
                  [`${name}`]: {
                    ...this.state[`${name}`],
                    fetchMore: this.fetchMore,
                    refetchQuery: this.refetchQuery
                  }
                }
              );
              break;
            case "PUSH":
              customProps =
                props &&
                typeof props === "function" &&
                props({ push: this.push, ...sanitizedProps });
              passedProps = this.buildProps(customProps, { push: this.push });
              break;
            default:
              customProps =
                props &&
                typeof props === "function" &&
                props({
                  mutate: this.mutate,
                  ...sanitizedProps,
                  [`${name}`]: { loading: this.state[`${name}`].loading }
                });
              passedProps = this.buildProps(customProps, {
                [`${name}`]: { loading: this.state[`${name}`].loading },
                mutate: this.mutate
              });
              break;
          }
          return passedProps;
        };

        render() {
          return [
            <DefiniteProgressBar
              progress={this.props.progressState.progress}
              key={0}
            />,
            <WrappedComponent key={1} {...this.sanitizePassedProps()} />
          ];
        }
      }
    );
  }
  return decorateClass;
};

export { composer };
