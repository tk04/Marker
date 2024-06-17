import TurndownService from "turndown";
import listItem from "./listItem";
import paragraph from "./paragraph";
import tableRow from "./table/tableRow";
import table from "./table/table";
import tableCell from "./table/tableCell";

const service = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

service.addRule("tableCell", tableCell);
service.addRule("table", table);
service.addRule("tableRow", tableRow);
service.addRule("paragraph", paragraph);
service.addRule("listItem", listItem);
export default service;
