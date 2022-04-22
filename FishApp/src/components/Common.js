import React, { Component } from 'react';
import { Text, Linking, View } from 'react-native';
import { Button as ElementButton, ListItem as ElementListItem, ButtonGroup as ElementButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Styles, { PRIMARY_BLUE, PRIMARY_GREY } from '../Styles';


// This function is used to prevent double pressing.
// Attribution: https://stackoverflow.com/a/47229486/137996
var globalDoublePressLock = null;
const withPreventDoubleClick = (WrappedComponent) => {

  class PreventDoubleClick extends React.PureComponent {

    debouncedOnPress = () => {
      this.props.onPress && this.props.onPress();
    }

    onPress = () => {
      console.log("withPreventDoubleClick.onPress");
      if (globalDoublePressLock === null) {
        globalDoublePressLock = {};
        this.debouncedOnPress();

        // This time is needed for slow phones transitioning from ResultsScreen to FishScreen.
        const lockTimeInMilliseconds = 1000;
        setTimeout(() => {
          globalDoublePressLock = null;
        }, lockTimeInMilliseconds);
      }
    }

    render() {
      return <WrappedComponent {...this.props} onPress={this.onPress} />;
    }
  }

  PreventDoubleClick.displayName = `withPreventDoubleClick(${WrappedComponent.displayName ||WrappedComponent.name})`
  return PreventDoubleClick;
}

export const Button = props => {
  const Debounced = withPreventDoubleClick(ElementButton);
  const buttonContainerViewStyle = { marginBottom: 10, marginLeft: 0, marginRight: 0, width: "100%" };
  return <Debounced buttonStyle={Styles.button} raised containerStyle={buttonContainerViewStyle} {...props} />;
}
export const ListItem = withPreventDoubleClick(ElementListItem);

export const MenuButton = (props) => {
  return <Button title={props.title} icon={props.icon} onPress={props.onPress} buttonStyle={Styles.menuButton} titleStyle={{ fontSize: 18 }} />;
}

export const MenuIcon = ({ name }) => {
  return <Icon name={name} color="#FFF" size={24} style={{ marginRight: 10 }}/>;
}

export class Anchor extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Text
        style={{...this.props.styles, color: 'blue'}}
        onPress={() => Linking.openURL(this.props.href)}
      >
        {this.props.children}
      </Text>
    );
  }
}

export class ModalContainer extends Component {
  timeOutId = null;

  constructor(props, modalIsVisible) {
    super(props);
    this.state = { modalIsVisible: modalIsVisible };
  }

  componentWillUnmount() {
    if (this.timeOutId !== null) {
      clearTimeout(this.timeOutId);
      this.timeOutId = null;
    }
  }

  modalCloseHandler = () => {
    this.setState({ modalIsVisible: false });
    console.log("Close modal");
  }

  showModal = () =>{ 
    this.setState({ modalIsVisible: true });
  }

  delayShowModal = (timeInMilliseconds) => {
    this.timeOutId = setTimeout(this.showModal, timeInMilliseconds);
  }
}

export function withModal(WrappedComponent, Modal) {
  class WithModal extends Component {
    state = { modalIsVisible: true }

    modalCloseHanlder = () => {
      this.setState({ modalIsVisible: false });
    }

    render() {
      return (
        <View>
          <WrappedComponent {...this.props} />
          <Modal isVisible={this.state.modalIsVisible} onClose={this.modalCloseHanlder} />
        </View>
      );
    }
  }
  WithModal.display = `WithModal(${getDisplayName(WrappedComponent)}, ${getDisplayName(Modal)})`; 
  return WithModal;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.dispatchName || WrappedComponent.name || "Component";
}

export const ButtonGroup = ({ name, buttons, selectedButton, onPress }) => {
  const handleOnPress = index => {
    onPress(name, buttons[index]);
  };

  return <ElementButtonGroup
    containerStyle={Styles.buttonGroupContainer} 
    buttonStyle={Styles.buttonGroup}
    textStyle={Styles.buttonGroup}
    selectedButtonStyle={Styles.selectedButton}
    selectedTextStyle={Styles.selectedButton}
    buttons={buttons}
    selectedIndex={buttons.indexOf(selectedButton)}
    onPress={handleOnPress}
  />;
}

export const YesNoButtonGroup = ({ name, value, onPress }) => {
  const buttons = [ "No", "Yes" ];
  const selectedButton = value ? "Yes" : (value === false ? "No" : null);
  const handleOnPress = (name, button) => {
    let value;
    if (button === "Yes") {
      value = true;
    } else if (button === "No") {
      value = false;
    } else {
      throw new Error(`Invalid button: ${button}.`);
    }
    onPress(name, value);
  };
  return <ButtonGroup name={name} buttons={buttons} selectedButton={selectedButton} onPress={handleOnPress} />;
}