import Notification from "../notification/notification";

export default abstract class Component {

  public notification: Notification;

  constructor() {
    this.notification = new Notification();
  }
}