import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IncomeTax from "./IncomeTax";
import GST from "./GST";
import MCA from "./MCA";
import PF from "./PF";
import ESIC from "./ESIC";
import TDS from "./TDS";
import FileUpload from "./FileUpload";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Tax(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          textColor="secondary"
          indicatorColor="secondary"
          value={value}
          onChange={handleChange}
          aria-label="services tabs"
          sx={{
            "& .Mui-disabled": {
              color: "black",
            },
          }}
        >
          <Tab label="Documents" {...a11yProps(0)} />
          <Tab
            label="Income Tax"
            {...a11yProps(1)}
            disabled={
              props.data.serviceAvailed
                ? !props.data.serviceAvailed.incomeTax
                : true
            }
          />
          <Tab
            label="GST"
            {...a11yProps(2)}
            disabled={
              props.data.serviceAvailed ? !props.data.serviceAvailed.gst : true
            }
          />
          <Tab
            label="MCA"
            {...a11yProps(3)}
            disabled={
              props.data.serviceAvailed ? !props.data.serviceAvailed.mca : true
            }
          />
          <Tab
            label="PF"
            {...a11yProps(4)}
            disabled={
              props.data.serviceAvailed ? !props.data.serviceAvailed.pf : true
            }
          />
          <Tab
            label="ESIC"
            {...a11yProps(5)}
            disabled={
              props.data.serviceAvailed ? !props.data.serviceAvailed.esic : true
            }
          />
          <Tab
            label="TDS"
            {...a11yProps(6)}
            disabled={
              props.data.serviceAvailed ? !props.data.serviceAvailed.tds : true
            }
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <FileUpload data={props.data} id={props.id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <IncomeTax data={props.data} id={props.id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <GST data={props.data} id={props.id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <MCA data={props.data} id={props.id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <PF data={props.data} id={props.id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <ESIC data={props.data} id={props.id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <TDS data={props.data} id={props.id} />
      </CustomTabPanel>
    </Box>
  );
}
