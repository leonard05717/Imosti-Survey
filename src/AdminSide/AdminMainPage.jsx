import { NavLink, Outlet } from "react-router-dom";
import { NavLink as MantineNavLink } from "@mantine/core";
import {
  IconCertificate,
  IconChartHistogram,
  IconMessage2Cog,
  IconSettings,
  IconUserShare,
} from "@tabler/icons-react";
import SingleNavLink from "../components/SingleNavLink";

function AdminMainPage() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: 270,
          height: "100%",
          backgroundColor: "gray",
          padding: 20,
        }}
      >
        <div style={{ width: "100%", padding: "20px 0" }}>
          <img
            style={{ width: "100%" }}
            src='/images/Admin-Logo.png'
          />
        </div>
        <SingleNavLink
          to='analytics'
          label='Analytics'
          Icon={IconChartHistogram}
        />
        <SingleNavLink
          to='courses'
          label='Courses'
          Icon={IconCertificate}
        />
        <SingleNavLink
          to='staff'
          label='Staff'
          Icon={IconUserShare}
        />
        <SingleNavLink
          to='maintenance'
          label='Maintenance'
          Icon={IconMessage2Cog}
        />
        <SingleNavLink
          to='settings'
          label='Settings'
          Icon={IconSettings}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "calc(100% - 270px)",
          height: "100%",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AdminMainPage;
