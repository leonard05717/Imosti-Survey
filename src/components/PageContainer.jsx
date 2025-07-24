import { ScrollAreaAutosize, Text } from "@mantine/core";

function PageContainer({ children, title, rightSection, outsideChildren }) {
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
        {rightSection}
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
