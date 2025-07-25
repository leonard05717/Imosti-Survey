import React from "react";

const PrintableSurvey = ({
  courseTitle = "Title",
  description,
  criteria,
  totalAverage,
  date,
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
          borderBottom: "1px solid #0005",
          paddingBottom: 50,
        }}
      >
        <img
          style={{ height: 150 }}
          src='/images/Admin-Logo.png'
        />
      </div>
      <div style={{ padding: "50px" }}>
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ margin: 0 }}>{courseTitle}</h3>
            <p>{date}</p>
          </div>
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
                      borderTop: "1px solid #0009",
                      width: "fit-content",
                      padding: "10px 20px",
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
    </div>
  );
};

export default PrintableSurvey;
