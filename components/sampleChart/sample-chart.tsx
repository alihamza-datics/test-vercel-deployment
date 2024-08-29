import React from "react";
import Chart from "react-apexcharts";

const SentimentsGraph = () => {
  const options = {
    chart: {
      height: 350,
      stacked: false,
    },
    stroke: {
      width: [0, 0, 2], // Adjust stroke width for each series
    },
    title: {
      text: "Sentiments Graph",
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [2], // Enable data labels only on the line series
    },
    labels: [
      "Customer Service",
      "Shipping",
      "Return Policy",
      "Ordering Process",
      "Communication",
      "Ordering Process", // repeated for the second ordering process
    ],
    xaxis: {
      categories: [
        "Customer Service",
        "Shipping",
        "Return Policy",
        "Ordering Process",
        "Communication",
        "Ordering Process", // repeated for the second ordering process
      ],
      labels: {
        rotate: -45, // Rotates the labels for better readability
      },
    },
    yaxis: {
      title: {
        text: "Sentiment Score",
      },
      min: -90,
      max: 90,
    },
    colors: ["#A020F0", "#FF00FF", "#00FF00"], // Custom colors for bars and line
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
  };

  const series = [
    {
      name: "Positive Sentiment",
      type: "bar",
      data: [67, 60, 75, 85, 30, 75],
    },
    {
      name: "Negative Sentiment",
      type: "bar",
      data: [-33, -48, -25, -27, -66, -15],
    },
    {
      name: "Net Sentiment",
      type: "line",
      data: [34, 12, 50, 58, -36, 60], // Example data for the line chart
    },
  ];

  return (
    <div>
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default SentimentsGraph;
