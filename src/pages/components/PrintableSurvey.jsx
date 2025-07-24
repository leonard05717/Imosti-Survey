import React from "react";

const PrintableSurvey = ({
  courseTitle = "Title",
  description,
  criteria,
  totalAverage,
}) => {
  return (
    <div style={{ padding: "20px", color: "#000", fontFamily: "Arial" }}>
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ margin: 0 }}>{courseTitle}</h4>
        <p style={{ fontSize: "15px" }}>- {description}</p>
      </div>

      <table style={{ width: "100%", marginBottom: "20px" }}>
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
                    borderTop: "1px solid red",
                    width: "fit-content",
                    padding: "0 20px",
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
                    }}
                  >
                    {j + 1}. {sub.name}
                  </td>
                  <td style={{ textAlign: "right", paddingRight: 20 }}>
                    {sub.average.toFixed(2)}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintableSurvey;
