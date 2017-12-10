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
      progressState: state.dataLoadProgress
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
            this.setLoadingDataState();
            let params =
              typeof options === "function"
                ? options(this.props).variables
                : options.variables;
            XMLHttp(method, params)
              .then(data => this.setSuccessDataState(data))
              .catch(error => this.setErrorDataState(error));
          }
        }

        setLoadingDataState = () => {
          this.setState({
            [`${name}`]: {
              ...this.state[`${name}`],
              loading: true
            }
          });
        };

        setSuccessDataState = data => {
          let initialDataSettings = {};
          if (method.toUpperCase() === "GET") {
            initialDataSettings = { isInitialDataSet: true };
          }
          this.setState({
            [`${name}`]: {
              ...this.state[`${name}`],
              ...initialDataSettings,
              loading: false,
              result: data
            }
          });
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
            .then(data => this.setSuccessDataState(data))
            .catch(error => this.setErrorDataState(error));
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
              this.props.route.setRouteDatas(goto, result.data);
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
              ...GeneralBasedUtils.sanitizeProps(this.props, ["progressState"]),
              ...customProps
            };
          }
          return {
            ...GeneralBasedUtils.sanitizeProps(this.props, ["progressState"]),
            ...defaultAdditionalProps
          };
        };

        sanitizePassedProps = () => {
          let passedProps = {},
            customProps = [];
          switch (method.toUpperCase()) {
            case "GET":
              customProps =
                props && typeof props === "function" && props(this.state);
              passedProps = this.buildProps(customProps, this.state);
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
                props({ mutate: this.mutate, ...this.state });
              passedProps = this.buildProps(customProps, {
                ...this.state,
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
