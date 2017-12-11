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

        componentWillReceiveProps(nextProps) {
          console.log("next props updated", nextProps);
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
            .then(data => this.setSuccessDataState(data))
            .catch(error => this.setErrorDataState(error));
        };

        refetchPageContent = ({ variables }) => {
          let params =
            variables || typeof arguments[0] === "function"
              ? arguments[0](this.props).variables
              : arguments[0].variables;
          arguments[1]("GET", params)
            .then(data => data => this.setSuccessDataState(data))
            .catch(error => this.setErrorDataState(error));
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
            typeof options === "function"
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
              typeof options === "function"
                ? options(this.props).refetchQueries &&
                  this.refetchQueries(options(this.props).refetchQueries)
                : options.refetchQueries &&
                  this.refetchQueries(options.refetchQueries);
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
                this.setSuccessDataState(newResult, () =>
                  this.props.route.setQueryDatas(name, newResult)
                );
              })
              .catch(error => this.setErrorDataState(error));
          } else {
            throw new Error("[updateQuery] is needed in [data.fetchMore]");
          }
        };

        fetchMorePageContent = ({ variables, updateQuery }) => {
          if (updateQuery) {
            let variablesConfig =
              variables || typeof arguments[0] === "function"
                ? arguments[0](this.props).variables
                : arguments[0].variables;
            this.setLoadingDataState();
            arguments[1]("GET", variablesConfig)
              .then(data => {
                let newResult = updateQuery(
                  this.props.routeDatas[this.props.history.location.pathname]
                    .result,
                  {
                    fetchMoreResult: data
                  }
                );
                this.setSuccessDataState(newResult, () =>
                  this.props.route.setRouteDatas(
                    "this.props.history.location.pathname",
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
              let refetchPageContent = this.refetchPageContent.bind(
                  this,
                  options,
                  XMLHttp
                ),
                fetchMorePageContent = this.fetchMorePageContent.bind(
                  this.options,
                  XMLHttp
                );
              this.props.route.setRouteDatas(goto, {
                result,
                fetchMorePageContent: ({ variables, updateQuery }) =>
                  fetchMorePageContent({ variables, updateQuery }),
                refetchPageContent: ({ variables }) =>
                  refetchPageContent({ variables })
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

        sanitizeCoreReduxComposerProps = props => {
          let newRoute = Object.keys(props.route).reduce((acc, value) => {
            if (
              !acc[value] &&
              value !== "setProgressState" &&
              value !== "completeProgressState" &&
              value !== "setRouteDatas" &&
              value !== "setQueryDatas"
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
                  "queryDatas"
                ])
              ),
              ...customProps
            };
          }
          return {
            ...this.sanitizeCoreReduxComposerProps(
              GeneralBasedUtils.sanitizeProps(this.props, [
                "progressState",
                "queryDatas"
              ])
            ),
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
