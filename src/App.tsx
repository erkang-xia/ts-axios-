import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import CryptoSummary from "./components/CryptoSummary";
import { Crypto } from "./components/Types";
import React from "react";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);
  const [selected, setSelected] = useState<Crypto | null>();
  const [data, setData] = useState<ChartData<"line">>();
  const [options, setOptions] = useState<ChartOptions<"line">>({
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  });

  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";
    axios.get(url).then((response) => {
      //console.log(response.data);
      setCryptos(response.data);
    });
  }, []);

  return (
    <>
      <div className="App">
        <select
          onChange={(e) => {
            const selec = cryptos?.find((x) => {
              return x.id === e.target.value;
            });

            setSelected(selec);
            axios
              .get(
                `https://api.coingecko.com/api/v3/coins/${selec?.id}/market_chart?vs_currency=usd&days=30&interval=daily`
              )
              .then((response) => {
                console.log(response.data);
                setData({
                  labels: response.data.prices.map((price: number[]) => {
                    return moment.unix(price[0] / 1000).format("MM-DD-YYYY");
                  }),
                  datasets: [
                    {
                      label: "Dataset 1",
                      data: response.data.prices.map((price: number[]) => {
                        return price[1];
                      }),
                      borderColor: "rgb(255, 99, 132)",
                      backgroundColor: "rgba(255, 99, 132, 0.5)",
                    },
                  ],
                });
              });
          }}
          defaultValue={"default"}
        >
          <option value={"default"}>Choose an option</option>
          {cryptos
            ? cryptos.map((crypto) => {
                return (
                  <option
                    key={crypto.id}
                    value={
                      crypto.id
                      //value let us know which one is clicked
                    }
                  >
                    {crypto.name}
                  </option>
                );
              })
            : null}
        </select>
      </div>
      {selected ? <CryptoSummary crypto={selected} /> : null}
      {data ? (
        <div style={{ width: 600 }}>
          <Line options={options} data={data} />{" "}
        </div>
      ) : null}
    </>
  );
}

export default App;
