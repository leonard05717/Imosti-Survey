import { Divider, Table } from "@mantine/core";
import React from "react";

const PrintableSurvey = ({
  courseTitle = "Title",
  description,
  criteria,
  totalAverage,
  date,
  storageData,
}) => {
  return (
    <div style={{ color: "#000", fontFamily: "Arial", position: "relative" }}>
      <img
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "100%",
          transform: "translate(-50%, -50%)",
          opacity: 0.1,
        }}
        src='/images/Logo.png'
      />
      <div
        style={{
          display: "grid",
          placeItems: "center",
        }}
      >
        <img
          style={{ height: 100 }}
          src='/images/Admin-Logo.png'
        />
      </div>
      <Divider my={30} />
      <div style={{ padding: "0 30px 30px 30px" }}>
        <div style={{ marginBottom: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ margin: 0, fontWeight: "bold", fontSize: "20px" }}>
              {courseTitle}
            </p>
            <p>{date}</p>
          </div>
          <p style={{ fontSize: "15px" }}>- {description}</p>
        </div>

        <table style={{ width: "100%", marginBottom: "10px" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingBottom: "8px" }}>
                CRITERIA
              </th>
              <th
                style={{
                  textAlign: "right",
                  paddingBottom: "8px",
                }}
              >
                Average
              </th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((item, i) => {
              return (
                <tr key={i}>
                  <th style={{ textAlign: "left" }}>{item.name}</th>
                  <td style={{ textAlign: "right", paddingRight: 20 }}>
                    {item.average.toFixed(2)}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td
                style={{ textAlign: "right" }}
                colSpan={2}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <div
                    style={{
                      borderTop: "1px solid #0009",
                      width: "fit-content",
                      padding: "6px 20px 0 20px",
                    }}
                  >
                    {totalAverage.toFixed(2)}
                  </div>
                </div>
              </td>
            </tr>
            {criteria.map((item, i) => (
              <React.Fragment key={i}>
                <tr>
                  <td style={{ padding: "5px 0", fontWeight: "bold" }}>
                    {item.name}
                  </td>
                  <td></td>
                </tr>
                {item.subItems?.map((sub, j) => (
                  <tr key={`${i}-${j}`}>
                    <td
                      style={{
                        paddingLeft: "20px",
                        paddingTop: "2px",
                        paddingBottom: "2px",
                        fontSize: 15,
                      }}
                    >
                      {j + 1}. {sub.name}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        paddingRight: 20,
                        fontSize: 15,
                      }}
                    >
                      {sub.average.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <Table
        borderColor='#0007'
        withTableBorder
        withColumnBorders
      >
        <Table.Tbody>
          <Table.Tr>
            <Table.Th
              rowSpan={2}
              ta='center'
            >
              INTERNAL
            </Table.Th>
            <Table.Th bg='#0002'>Form Number:</Table.Th>
            <Table.Td>{storageData.form_number}</Table.Td>
            <Table.Th
              rowSpan={2}
              bg='#0002'
            >
              Date Issued:
            </Table.Th>
            <Table.Td rowSpan={2}>{new Date().toDateString()}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th bg='#0002'>Revision Number:</Table.Th>
            <Table.Td style={{ borderRight: "1px solid #0007" }}>
              {storageData.revision_number}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default PrintableSurvey;
