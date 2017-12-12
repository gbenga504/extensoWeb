/**
 * @function is a [HOC] that takes the wrapped component along with its 
 * config options to decorate a new component containing the new props 
 */
import React from "react";
import { connect } from "react-redux";

import { Throwable } from "./helpers/throwable";
import { GeneralBasedUtils } from "../../utils";
import XMLHttp from "./httpRequest";
import DefiniteProgressBar from "./DefiniteProgressBar";

const composer = (method, { props, name, options }) => {
  Throwable.initThrowable(method, { name, options });

  function decorateClass(WrappedComponent) {
    return connect(state => ({
      progressState: state.dataLoadProgress,
      routeDatas: state.routeDatas,
      queryDatas: state.queryDatas
    }))(
      class extends React.PureComponent {
        constructor(props) {
          super(props);
          let initialDataSettings =
            method.toUpperCase() === "GET" || method.toUpperCase() === "CONNECT"
              ? { isInitialDataSet: false }
              : {};
          this.state = { [`${name}`]: { ...initialDataSettings } };
        }

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
                this.refetchQuery({});
                break;
              case "cache-only":
                this.setInitialStateAfterMount();
                break;
              case "cache-and-network":
                this.setInitialStateAfterMount();
                this.refetchQuery({});
                break;
              default:
                let { location: { pathname } } = this.props;
                if (
                  this.props.queryDatas[name] ||
                  this.props.routeDatas[pathname]
                ) {
                  this.setInitialStateAfterMount();
                } else {
                  this.refetchQuery({});
                }
                break;
            }
          }
        }

        setInitialStateAfterMount = () => {
          let { location: { pathname } } = this.props;
          this.setState({
            [`${name}`]: {
              ...this.state[`${name}`],
              loading: false,
              isInitialDataSet: true,
              result:
                method.toUpperCase() === "GET"
                  ? this.props.queryDatas[name]
                  : this.props.routeDatas[pathname]
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
            let { location: { pathname } } = this.props;
            this.props.route.setRouteDatas(pathname, data);
          }
          this.setState(
            {
              [`${name}`]: {
                ...this.state[`${name}`],
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
          if (config) {
            params = config;
          } else {
            params =
              typeof options === "function"
                ? options(this.props).variables
                : options.variables;
          }
          return params;
        };

        refetchQuery = config => {
          this.setLoadingDataState();
          let params = this.getHttpParams(config);

          XMLHttp(method, params)
            .then(data => {
              this.setSuccessDataState(data);
            })
            .catch(error => {
              this.setErrorDataState(error);
            });
        };

        refetchQueries = arrayOfVariables => {
          arrayOfVariables.forEach(variables => {
            XMLHttp("GET", variables)
              .then(data => {
                this.props.route.setQueryDatas(variables.name, data);
              })
              .catch(error => console.warn(error));
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
                : options.refetchQueries &&
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
              return error;
            });
        };

        fetchMore = config => {
          if (config.updateQuery) {
            let variablesConfig = this.getHttpParams(config.variables);

            this.setLoadingDataState();
            XMLHttp(method, variablesConfig)
              .then(data => {
                let newResult = config.updateQuery(
                    this.state[`${name}`].result,
                    {
                      fetchMoreResult: data
                    }
                  ),
                  { location: { pathname } } = this.props,
                  operationToRun =
                    method.toUpperCase() === "GET"
                      ? () => this.props.route.setQueryDatas(name, newResult)
                      : () =>
                          this.props.route.setRouteDatas(pathname, newResult);

                this.setSuccessDataState(newResult, operationToRun);
              })
              .catch(error => this.setErrorDataState(error));
          } else {
            throw new Error("[updateQuery] is needed in [data.fetchMore]");
          }
        };

        calculateProgress = computed =>
          this.props.route.setProgressState(computed * 50);

        push = optionsConfig => {
          let params = this.getHttpParams(optionsConfig.variables);

          XMLHttp("GET", params, this.calculateProgress)
            .then(result => {
              this.props.route.setRouteDatas(optionsConfig.goto, result);
              setTimeout(() => {
                setTimeout(
                  () => this.props.route.completeProgressState(50),
                  10
                );
                this.props.history.push(optionsConfig.goto);
              }, 10);
            })
            .catch(err => null);
        };

        sanitizeCoreReduxComposerProps = props => {
          let newRoute = Object.keys(props.route).reduce((acc, value) => {
            if (
              !acc[value] &&
              (value !== "setProgressState" &&
                value !== "completeProgressState" &&
                value !== "setRouteDatas" &&
                value !== "setQueryDatas")
            ) {
              acc[value] = props.route[value];
            }
            return acc;
          }, {});
          return { ...props, route: newRoute };
        };

        buildProps = (customProps, defaultAdditionalProps) => {
          if (
            typeof customProps === "object" &&
            customProps.length === undefined
          ) {
            return {
              ...this.sanitizeCoreReduxComposerProps(
                GeneralBasedUtils.sanitizeProps(this.props, [
                  "progressState",
                  "queryDatas",
                  "routeDatas"
                ])
              ),
              ...customProps
            };
          }
          return {
            ...this.sanitizeCoreReduxComposerProps(
              GeneralBasedUtils.sanitizeProps(this.props, [
                "progressState",
                "queryDatas",
                "routeDatas"
              ])
            ),
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
