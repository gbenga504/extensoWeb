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
      queryDatas: state.queryDatas
    }))(
      class extends React.PureComponent {
        constructor(props) {
          super(props);
          let initialDataSettings =
            method.toUpperCase() === "GET" ? { isInitialDataSet: false } : {};
          this.state = { [`${name}`]: { ...initialDataSettings } };
        }

        componentDidMount() {
          if (method.toUpperCase() === "GET") {
            let fetchPolicy =
              typeof options === "function"
                ? options(this.props).fetchPolicy
                : options.fetchPolicy || "cache-first";
            switch (fetchPolicy) {
              case "network-only":
                this.setLoadingDataState();
                this.refetchQuery({});
                break;
              case "cache-only":
                this.setInitialStateAfterMount();
                break;
              case "cache-and-network":
                this.setInitialStateAfterMount();
                this.setLoadingDataState();
                this.refetchQuery({});
                break;
              default:
                if (this.props.queryDatas[`${name}`]) {
                  this.setInitialStateAfterMount();
                } else {
                  this.setLoadingDataState();
                  this.refetchQuery({});
                }
                break;
            }
          }
        }

        setInitialStateAfterMount = () => {
          this.setState({
            [`${name}`]: {
              ...this.state[`${name}`],
              loading: false,
              isInitialDataSet: true,
              result: this.props.queryDatas[`${name}`]
            }
          });
        };

        refetchQuery = ({ variables }) => {
          let params =
            variables || typeof options === "function"
              ? options(this.props).variables
              : options.variables;
          XMLHttp(method, params)
            .then(data => data => this.setSuccessDataState(data))
            .catch(error => this.setErrorDataState(error));
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

        mutate = variablesConfig => {
          let params =
            (variablesConfig && variablesConfig.variables) ||
            typeof options.variables === "function"
              ? options(this.props).variables
              : options.variables;

          this.setLoadingDataState();
          XMLHttp(method, params)
            .then(data => {
              this.setState({
                [`${name}`]: {
                  ...this.state[`${name}`],
                  loading: false
                }
              });
              return Promise.resolve(data);
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

        fetchMore = ({ variables, updateQuery }) => {
          if (updateQuery) {
            let variablesConfig =
              variables || typeof options === "function"
                ? options(this.props).variables
                : options.variables;
            this.setLoadingDataState();
            XMLHttp(method, variablesConfig)
              .then(data => {
                let newResult = updateQuery(this.state[`${name}`].result, {
                  fetchMoreResult: data
                });
                this.setSuccessDataState(
                  newResult,
                  () =>
                    method.toUpperCase() === "GET"
                      ? this.props.route.setQueryDatas(name, newResult)
                      : this.props.route.setRouteDatas(
                          this.props.history.location.pathname,
                          newResult
                        )
                );
              })
              .catch(error => this.setErrorDataState(error));
          } else {
            throw new Error("[updateQuery] is needed in [data.fetchMore]");
          }
        };

        calculateProgress = computed =>
          this.props.setProgressState(computed * 50);

        push = (variablesConfig, goto) => {
          let params =
            variablesConfig || typeof options === "function"
              ? options(this.props).variables
              : options.variables;

          XMLHttp("GET", params, this.calculateProgress)
            .then(result => {
              this.props.route.setRouteDatas(goto, {
                result,
                fetchMore: this.fetchMore,
                refetchQuery: this.refetchQuery
              });
              setTimeout(() => {
                setTimeout(
                  () => this.props.route.completeProgressState(50),
                  10
                );
                this.props.history.push(goto);
              }, 10);
            })
            .catch(err => null);
        };

        buildProps = (customProps, defaultAdditionalProps) => {
          if (
            typeof customProps === "object" &&
            customProps.length === undefined
          ) {
            return {
              ...GeneralBasedUtils.sanitizeProps(this.props, [
                "progressState",
                "queryDatas"
              ]),
              ...customProps
            };
          }
          return {
            ...GeneralBasedUtils.sanitizeProps(this.props, [
              "progressState",
              "queryDatas"
            ]),
            ...defaultAdditionalProps
          };
        };

        sanitizePassedProps = () => {
          let passedProps = {},
            customProps = [];
          switch (method.toUpperCase()) {
            case "GET":
              customProps =
                props &&
                typeof props === "function" &&
                props({
                  [`${name}`]: {
                    ...this.state[`${name}`],
                    fetchMore: this.fetchMore,
                    refetchQuery: this.refetchQuery
                  }
                });
              passedProps = this.buildProps(customProps, {
                [`${name}`]: {
                  ...this.state[`${name}`],
                  fetchMore: this.fetchMore,
                  refetchQuery: this.refetchQuery
                }
              });
              break;
            case "PUSH":
              customProps =
                props &&
                typeof props === "function" &&
                props({ push: this.push });
              passedProps = this.buildProps(customProps, { push: this.push });
              break;
            default:
              customProps =
                props &&
                typeof props === "function" &&
                props({
                  mutate: this.mutate,
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
