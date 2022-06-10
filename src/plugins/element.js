
import Vue from "vue";
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
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
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  ButtonGroup,
  Timeline,
  TimelineItem,
  Notification
} from "element-ui";


const plugins = [
  Button,
  Form,
  FormItem,
  Input,
  Container,
  Header,
  Aside,
  Main,
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
  Tooltip,
  Pagination,
  Dialog,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  ButtonGroup,
  Timeline,
  TimelineItem,
]


function getPlugins(Vue) {
  plugins.forEach(item => {
    Vue.use(item)
  })
}
getPlugins(Vue);

Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;
Vue.prototype.$confirm = MessageBox.confirm;
