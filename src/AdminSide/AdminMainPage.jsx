import { Navigate, NavLink, Outlet } from "react-router-dom";
import { CloseButton, NavLink as MantineNavLink } from "@mantine/core";
import {
  IconCertificate,
  IconChartHistogram,
  IconMessage2Cog,
  IconSettings,
  IconUserShare,
} from "@tabler/icons-react";
import SingleNavLink from "../components/SingleNavLink";
import { useDrawer } from "../context/DrawerContext";
import { getAccount } from "../supabase";

function AdminMainPage() {
  const account = getAccount();
  const { isOpen, setIsOpen } = useDrawer();

  if (!account) {
    return <Navigate to='/login' />;
  }

  return (
    <div
      id='drawer'
      className='flex w-full h-screen'
    >
      <div
        style={{ backgroundColor: "gray" }}
        data-open={isOpen}
        className='data-[open=true]:left-[0] w-[270px] duration-150 h-full p-5 fixed md:relative z-10 left-[-270px] md:left-[0]'
      >
        <div className='absolute top-2 right-2 block md:hidden text-white'>
          <CloseButton
            onClick={() => setIsOpen(false)}
            color='white'
            variant='transparent'
          />
        </div>
        <div className='w-full py-5'>
          <img
            className='w-full'
            src='/images/Admin-Logo.png'
            alt='Admin Logo'
          />
        </div>
        <SingleNavLink
          onClick={() => setIsOpen(false)}
          to='analytics'
          label='Analytics'
          Icon={IconChartHistogram}
        />
        <SingleNavLink
          onClick={() => setIsOpen(false)}
          to='courses'
          label='Courses'
          Icon={IconCertificate}
        />
        <SingleNavLink
          onClick={() => setIsOpen(false)}
          to='staff'
          label='Staff'
          Icon={IconUserShare}
        />
        <SingleNavLink
          onClick={() => setIsOpen(false)}
          to='maintenance'
          label='Maintenance'
          Icon={IconMessage2Cog}
        />
        <SingleNavLink
          onClick={() => setIsOpen(false)}
          to='settings'
          label='Settings'
          Icon={IconSettings}
        />
      </div>
      <div className='flex flex-col md:w-[calc(100%-270px)] w-full h-full'>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminMainPage;
