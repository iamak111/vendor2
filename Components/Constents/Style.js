import { Dimensions, StyleSheet } from "react-native";
import Colors from "./Colors";
const CommonStyle = StyleSheet.create({
  mt_10: {
    marginTop: 10,
  },
  mt_20: {
    marginTop: 20,
  },
  mt_30: {
    marginTop: 30,
  },
  mt_40: {
    marginTop: 40,
  },
  me_5: {
    marginEnd: 5,
  },
  me_25: {
    marginEnd: 25,
  },
  w_25: {
    width: "25%",
  },
  w_50: {
    width: "50%",
  },
  w_75: {
    width: "75%",
  },
  w_80: {
    width: "80%",
  },
  w_100: {
    width: "100%",
  },
  justifyContent_center: {
    justifyContent: "center",
  },
  alignSelf: {
    alignSelf: "center",
  },
  position_absolute: {
    position: "absolute",
  },
  position_relative: {
    position: "relative",
  },
  text_center: {
    textAlign: "center",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  flex_center: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  flex_spacearound: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  flex_spacebetween: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WEIGHT_COLOR,
  },
  button_light: {
    backgroundColor: Colors.WEIGHT_COLOR,
    color: Colors.MAIN_COLOR,
    padding: 10,
    width: "50%",
    alignSelf: "center",
    textAlign: "center",
    borderRadius: 20,
    borderColor: Colors.MAIN_COLOR,
    borderWidth: 1,
  },
  button_dark: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WEIGHT_COLOR,
    padding: 10,
    width: "50%",
    alignSelf: "center",
    textAlign: "center",
    borderRadius: 20,
  },
  text_input: {
    borderRadius: 50,
    backgroundColor: Colors.WEIGHT_COLOR,
    padding: 8,
    borderColor: Colors.MAIN_COLOR,
    borderWidth: 1,
    paddingStart: 20,
    paddingRight: 20,
  },
  backgroundColor_main: {
    backgroundColor: Colors.MAIN_COLOR,
  },
  floating_button: {
    position: "absolute",
    right: 10,
    top: Dimensions.get("window").height - 120,
  },
  title_text: {
    color: Colors.MAIN_COLOR,
    fontSize: 18,
    fontWeight: "bold",
  },
  rounded_border: {
    borderWidth: 1,
    borderColor: Colors.MAIN_COLOR,
    padding: 3,
    borderRadius: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  address_button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.WEIGHT_COLOR,
    margin: 2,
    marginTop: 10,
  },
  active_button: {
    backgroundColor: Colors.MAIN_COLOR,
    textAlign: "center",
    padding: 10,
    borderRadius: 50,
    color: Colors.WEIGHT_COLOR,
  },
});

const OnBordScreen = StyleSheet.create({
  background_box: {
    backgroundColor: Colors.WEIGHT_COLOR,
    width: Dimensions.get("window").width / 2,
    height: Dimensions.get("window").height,
    position: "absolute",
    top: 0,
  },
  first_half: {
    backgroundColor: Colors.WEIGHT_COLOR,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2,
    borderBottomRightRadius: 100,
  },
  second_half: {
    backgroundColor: Colors.MAIN_COLOR,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2,
    borderTopLeftRadius: 100,
  },
  img: {
    width: Dimensions.get("window").width - 50,
    height: Dimensions.get("window").width - 50,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.WEIGHT_COLOR,
    textAlign: "center",
  },
  des: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.WEIGHT_COLOR,
    textAlign: "center",
    width: "70%",
    alignSelf: "center",
  },
  button: {
    backgroundColor: Colors.WEIGHT_COLOR,
    color: Colors.MAIN_COLOR,
    padding: 10,
    width: "50%",
    alignSelf: "center",
    textAlign: "center",
    borderRadius: 20,
  },
  circle_light: {
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 100,
    width: 12,
    height: 12,
  },
  circle_dark: {
    backgroundColor: Colors.MAIN_COLOR,
    borderRadius: 100,
    width: 12,
    height: 12,
  },
  edit_button: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: Colors.MAIN_COLOR,
    position: "absolute",
    top: 20,
    right: 20,
  },
});

const LoginStyle = StyleSheet.create({
  first_half: {
    backgroundColor: Colors.WEIGHT_COLOR,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 1.8,
  },
  second_half: {
    backgroundColor: Colors.MAIN_COLOR,
    width: Dimensions.get("window").width,
    height:
      Dimensions.get("window").height - Dimensions.get("window").height / 1.8,
    borderTopLeftRadius: 100,
  },
  img: {
    width: Dimensions.get("window").width - 50,
    height: Dimensions.get("window").width - 50,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.MAIN_COLOR,
    textAlign: "center",
  },
  des: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.GRAY_COLOR,
    textAlign: "center",
    width: "70%",
    alignSelf: "center",
  },
  logo: {
    fontSize: 24,
    color: Colors.MAIN_COLOR,
    padding: 20,
    borderRadius: 100,
    backgroundColor: Colors.WEIGHT_COLOR,
    width: 76,
    alignSelf: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  login_text: {
    color: Colors.WEIGHT_COLOR,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const HeaderStyle = StyleSheet.create({
  flex_spacebetween: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",
    padding: 5,
  },
  logo: {
    fontSize: 20,
    color: Colors.WEIGHT_COLOR,
    fontWeight: "bold",
  },
  logo_small: {
    fontSize: 12,
    color: Colors.WEIGHT_COLOR,
  },
  cart_text: {
    position: "absolute",
    padding: 3,
    color: Colors.WEIGHT_COLOR,
    backgroundColor: Colors.MAIN_COLOR,
    fontSize: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.WEIGHT_COLOR,
    fontWeight: "bold",
    right: -5,
    top: -2,
  },
  search_bar: {
    backgroundColor: Colors.WEIGHT_COLOR,
    height: 40,
  },
  tab_bar_icon: {
    marginTop: -20,
    backgroundColor: Colors.MAIN_COLOR,
    padding: 10,
    borderRadius: 100,
    borderColor: Colors.WEIGHT_COLOR,
    borderWidth: 1,
  },
});

const CategoryStyle = StyleSheet.create({
  flex_spacearound: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    padding: 5,
  },
  category_card: {
    width: Dimensions.get("window").width / 2 - 40,
    borderRadius: 10,
    backgroundColor: Colors.MAIN_COLOR,
    padding: 0,
    height: 200,
  },
  inside_corve: {
    backgroundColor: Colors.WEIGHT_COLOR,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 100,
    height: 120,
  },
  img: {
    width: Dimensions.get("window").width / 2 - 50,
    alignSelf: "center",
    height: 150,
    marginTop: -110,
  },
  card_text: {
    color: Colors.WEIGHT_COLOR,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 5,
  },
});

const CartStyle = StyleSheet.create({
  cart_card: {
    width: Dimensions.get("window").width - 20,
    borderRadius: 10,
    backgroundColor: Colors.WEIGHT_COLOR,
    padding: 10,
    margin: 0,
    marginTop: 10,
  },
  card_img: {
    margin: 0,
    borderRadius: 10,
    padding: 5,
  },
  img: {
    width: 100,
    alignSelf: "center",
    height: 100,
  },
  card_title: {
    color: Colors.MAIN_COLOR,
    fontSize: 16,
    fontWeight: "bold",
  },
  small_text: {
    fontSize: 12,
    color: Colors.MAIN_COLOR,
  },
  price_dis: {
    color: Colors.MAIN_COLOR,
    fontSize: 18,
    marginTop: 10,
    fontWeight: "900",
  },
  price: {
    color: Colors.LIGHT_GRAY,
    fontSize: 16,
    fontWeight: "900",
    textDecorationLine: "line-through",
  },
  button_light: {
    backgroundColor: Colors.WEIGHT_COLOR,
    color: Colors.MAIN_COLOR,
    padding: 5,
    borderRadius: 20,
    borderColor: Colors.MAIN_COLOR,
    borderWidth: 1,
    width: Dimensions.get("window").width / 2.6,
    fontWeight: "bold",
  },
  button_delete: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WEIGHT_COLOR,
    padding: 5,
    borderRadius: 20,
    borderColor: Colors.MAIN_COLOR,
    borderWidth: 1,
    width: Dimensions.get("window").width / 5,
    fontWeight: "bold",
    marginLeft: 5,
    textAlign: "center",
  },
  meve_check_button: {
    backgroundColor: Colors.MAIN_COLOR,
    width: "50%",
    padding: 8,
    borderRadius: 20,
    alignSelf: "flex-end",
    marginBottom: 20,
    marginEnd: 5,
  },
});

const HomeStyle = StyleSheet.create({
  category_img: {
    width: 70,
    alignSelf: "center",
    height: 70,
    borderRadius: 100,
    borderColor: Colors.LIGHT_GRAY,
    borderWidth: 3,
  },
  category_txt: {
    fontWeight: "bold",
    color: Colors.BLACK_COLOR,
    textAlign: "center",
    alignSelf: "center",
    width: 70,
  },
  banner_image: {
    width: Dimensions.get("window").width - 20,
    height: 150,
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.LIGHT_GRAY,
    borderWidth: 1,
    marginTop: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.LIGHT_GRAY,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Colors.MAIN_COLOR,
  },
  left_arrow: {
    position: "absolute",
    top: 140,
    backgroundColor: Colors.WEIGHT_COLOR,
    padding: 3,
    borderRadius: 5,
    elevation: 3,
    paddingEnd: 0,
    paddingStart: 0,
  },
  productImage: {
    width: "95%",
    height: 120,
    alignSelf: "center",
    position: "absolute",
    top: 10,
  },
  card_button_w: {
    backgroundColor: Colors.WEIGHT_COLOR,
    color: Colors.MAIN_COLOR,
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    width: "100%",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  card_txt: {
    fontWeight: "bold",
    color: Colors.WEIGHT_COLOR,
    fontSize: 18,
  },
  card_container: {
    height: 140,
    padding: 10,
    backgroundColor: Colors.MAIN_COLOR,
    borderTopLeftRadius: 60,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  card: {
    height: 230,
    width: Dimensions.get("window").width / 2.5,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 10,
    margin: 10,
    position: "relative",
  },
});

const ShopScreenStyle = StyleSheet.create({
  dropdownButton: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    padding: 5,
    borderRadius: 5,
    width: "100%",
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",
  },
  dropdownOptions: {
    position: "absolute",
    width: "50%",
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 5,
    top: 35,
    backgroundColor: "white",
    right: 0,
  },
  card: {
    borderRadius: 10,
    backgroundColor: Colors.WEIGHT_COLOR,
    padding: 10,
    elevation: 3,
    width: Dimensions.get("window").width / 2 - 20,
    margin: 5,
    height: 230,
  },
  productImage: {
    width: "95%",
    height: 120,
    alignSelf: "center",
  },
  card_txt: {
    fontWeight: "bold",
    color: Colors.MAIN_COLOR,
    fontSize: 18,
  },
  card_button: {
    backgroundColor: Colors.MAIN_COLOR,
    color: Colors.WEIGHT_COLOR,
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    width: "100%",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  wish_list: {
    padding: 5,
    borderRadius: 100,
    borderColor: Colors.GRAY_COLOR,
    position: "absolute",
    right: 5,
    top: 5,
    borderWidth: 0.2,
    backgroundColor: Colors.WEIGHT_COLOR,
  },
  filter_container: {
    position: "absolute",
    padding: 10,
    backgroundColor: Colors.MAIN_COLOR,
    bottom: 0,
    width: "100%",
  },
  filters: {
    color: Colors.WEIGHT_COLOR,
    fontWeight: "bold",
    fontSize: 18,
    marginStart: 10,
  },
  modal_view: {
    backgroundColor: "white",
    height: Dimensions.get("window").height - 160,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 90,
    position: "relative",
  },
});

module.exports = {
  CommonStyle,
  OnBordScreen,
  LoginStyle,
  HeaderStyle,
  CategoryStyle,
  CartStyle,
  HomeStyle,
  ShopScreenStyle,
};

// https://www.figma.com/file/R9eYSIctoT619Tq9MOMYJR/E-Commerce-Mobile-app-templet?type=design&node-id=0%3A1&mode=design&t=ZFs8dP0r2ShMvEzQ-1
