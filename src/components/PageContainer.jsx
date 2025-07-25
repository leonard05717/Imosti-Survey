import {
  ActionIcon,
  Avatar,
  Button,
  Menu,
  ScrollAreaAutosize,
  Text,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { getAccount } from "../supabase";
import { modals } from "@mantine/modals";
import { useNavigate } from "react-router-dom";

function PageContainer({ children, title, rightSection, outsideChildren }) {
  const account = getAccount();
  const navigate = useNavigate();

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
    navigate("/LoginPage");
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {outsideChildren}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgb(148, 163, 184)",
          height: "3.5rem",
          backgroundColor: "#FF6900",
          padding: "0 20px",
          color: "white",
        }}
      >
        <Text
          fw='bold'
          title={title}
        >
          {title}
        </Text>
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
                  {account
                    ? `${account.First_Name} ${account.Last_Name}`
                    : "No Account Found"}
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
