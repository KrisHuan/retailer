import Vue from "vue";
import {
  Form,
  FormItem,
  Button,
  Input,
  Message,
  Header,
  Aside,
  Main,
  Container,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  ButtonGroup,
  Tooltip,
  Pagination,
  Dialog,
} from "element-ui";

Vue.use(Dialog);
Vue.use(Pagination);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Container);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Col);
Vue.use(Row);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(ButtonGroup);
Vue.use(Tooltip);

Vue.prototype.$message = Message;
