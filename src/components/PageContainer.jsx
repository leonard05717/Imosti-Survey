import {
  ActionIcon,
  Avatar,
  Button,
  Menu,
  ScrollAreaAutosize,
  Text,
} from "@mantine/core";
import { IconLogout, IconMenu, IconMenu2 } from "@tabler/icons-react";
import { getAccount } from "../supabase";
import { modals } from "@mantine/modals";
import { useNavigate } from "react-router-dom";
import { useDrawer } from "../context/DrawerContext";

function PageContainer({ children, title, rightSection, outsideChildren }) {
  const account = getAccount();
  const navigate = useNavigate();
  const { setIsOpen } = useDrawer();

  async function logoutEventHandler() {
    const conf = await new Promise((resolve, reason) => {
      modals.openConfirmModal({
        title: "Confirmation",
        children: <div className='pt-3'>Are you sure you want to logout?</div>,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
    if (!conf) return;
    localStorage.removeItem("data");
    navigate("/login");
  }

  return (
    <div className='h-full w-full relative flex flex-col gap-2'>
      {outsideChildren}
      <div className='flex items-center justify-between border-b border-slate-400 h-14 bg-[#FF6900] px-5 text-white'>
        <div className='flex items-center gap-x-2'>
          <div className='h-[1.8rem] block md:hidden'>
            <ActionIcon
              variant='subtle'
              color='white'
              onClick={() => setIsOpen(true)}
            >
              <IconMenu2 size={25} />
            </ActionIcon>
          </div>
          <Text
            fw='bold'
            title={title}
          >
            {title}
          </Text>
        </div>
        <div className='flex items-center gap-x-2'>
          {rightSection}
          <Menu
            withArrow
            styles={{
              arrow: {
                borderTop: "1px solid #0005",
                borderLeft: "1px solid #0005",
              },
            }}
          >
            <Menu.Target>
              <div className='flex items-center gap-x-2 pl-2 rounded-sm cursor-pointer hover:opacity-90 active:opacity-60 select-none'>
                <Text size='sm'>
                  {account ? account.Last_Name : "No Account Found"}
                </Text>
                <Avatar
                  src={account?.profile || ""}
                  variant='transparent'
                  color='white'
                  size={32}
                />
              </div>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                width: 180,
                boxShadow: "1px 2px 3px #0005",
                border: "1px solid #0005",
              }}
            >
              <Menu.Item
                onClick={logoutEventHandler}
                leftSection={<IconLogout size={18} />}
              >
                Log Out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
      <ScrollAreaAutosize
        w='100%'
        h='calc(100% - 3.5rem)'
        px={15}
        py={15}
      >
        {children}
      </ScrollAreaAutosize>
    </div>
  );
}

export default PageContainer;
