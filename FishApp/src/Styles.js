import { StyleSheet } from 'react-native';

export const PRIMARY_BLUE = "#3f5ba2";
export const PRIMARY_GREY = "#414141";
export const LIGHT_GREY = "#e8e8e8";
export const TEXT_COLOUR = "#333333";

export default StyleSheet.create({
  blueColor: { color: PRIMARY_BLUE },
  greyColor: { color: PRIMARY_GREY },
  listItemContainer: { borderBottomWidth: 1, borderBottomColor: LIGHT_GREY },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  button: { backgroundColor: PRIMARY_BLUE },
  menuButton: { backgroundColor: PRIMARY_BLUE, height: 60 },
  buttonText: { color: "#FFF" },
  buttonGroup: { backgroundColor: LIGHT_GREY },
  buttonGroupText: { color: TEXT_COLOUR },
  selectedButton: { backgroundColor: PRIMARY_BLUE },
  buttonGroupContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    marginTop: 0,
    marginBottom: 20,
    textAlignVertical: "top"
  },
  // Attribution: https://stackoverflow.com/a/44046858/137996
  activityIndicatorView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
