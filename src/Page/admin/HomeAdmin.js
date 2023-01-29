import React, { useEffect, useState, useRef } from "react";
import { Card, Row, Col, Button, Image, DatePicker } from "antd";
import { Pie, Bar, Line } from "@ant-design/plots";
import { DownloadOutlined } from "@ant-design/icons";
import logoevening from "../../img/evening.png";
import logomorning from "../../img/morning.png";
import logoafternoon from "../../img/afternoon.png";
import { formatdolla, showToast } from "../../util/helper";
import Spinner from "../../Page/client/components/spinner";
const { RangePicker } = DatePicker;
import dayjs from "dayjs";
import { sendPostRequest } from "../../util/fetchAPI";
import { baseURL } from "../../util/constants";

export default function HomeAdmin() {
  const [sessionTime, setsessionTime] = useState();
  const [logoSessionTime, setlogoSessionTime] = useState();
  const [thisMonthNumber, setthisMonthNumber] = useState(0);
  const [thisDayNumber, setthisDayNumber] = useState(0);
  const [totalMonth, settotalMonth] = useState(0);
  const [dataChartPie, setdataChartPie] = useState([]);
  const [thisYear, setthisYear] = useState();
  const [dataChartColumn, setdataChartColumn] = useState([]);
  const [reload, setIsReload] = useState(false);
  const [showContent, setshowContent] = useState(false);
  const [dataTopsaleProduct, setDataTopsaleProduct] = useState([]);
  const [filter, setFilter] = useState({
    start: dayjs(new Date())
      .startOf("M")
      .format("YYYY-MM-DD"),
    end: dayjs(new Date())
      .endOf("M")
      .format("YYYY-MM-DD"),
  });

  const refPie = useRef();
  const refBar = useRef();
  const refLine = useRef();

  useEffect(() => {
    let data = [
      [0, 11, "Good morning !"],
      [12, 17, "Good afternoon !"],
      [18, 24, "Good evening !"],
    ];
    let hr = new Date().getHours();
    for (var i = 0; i < data.length; i++) {
      if (hr >= data[i][0] && hr <= data[i][1]) {
        setsessionTime(data[i][2]);
        if (i === 0) {
          setlogoSessionTime(logomorning);
        } else if (i === 1) {
          setlogoSessionTime(logoafternoon);
        } else {
          setlogoSessionTime(logoevening);
        }
      }
    }

    getAllOrder();
    getOrderStatistic();
    getTopsaleProduct();
  }, []);

  useEffect(() => {
    getAllOrder();
    getOrderStatistic();
    getTopsaleProduct();
    setIsReload(false);
  }, [reload]);

  async function getAllOrder() {
    const postData = {
      data: {
        start: filter.start,
        end: filter.end,
      },
    };
    const response = await sendPostRequest(
      `${baseURL}/order/filtered-date`,
      postData
    );
    if (response.status == "success") {
      setValueStatis(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  async function getTopsaleProduct() {
    const postData = {
      data: {
        start: filter.start,
        end: filter.end,
      },
    };
    const response = await sendPostRequest(
      `${baseURL}/product/getTopsaleProduct`,
      postData
    );
    if (response.status == "success") {
      setDataTopsaleProduct(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  const [orderStatistic, setOrderStatistic] = useState([]);
  async function getOrderStatistic() {
    const postData = {
      data: {
        start: filter.start,
        end: filter.end,
      },
    };
    const response = await sendPostRequest(
      `${baseURL}/order/statistic`,
      postData
    );
    if (response.status == "success") {
      var tempArr = [];
      tempArr = response.data;
      tempArr.map((item, index) => {
        switch (item.status) {
          case 0:
            tempArr[index].status = "Processing";
            break;
          case 1:
            tempArr[index].status = "Delivering";
            break;
          case 2:
            tempArr[index].status = "Delivered";
            break;
          case 3:
            tempArr[index].status = "Cancelled";
            break;
          case 4:
            tempArr[index].status = "Refund";
            break;

          default:
            break;
        }
      });
      setOrderStatistic(tempArr);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  const configOrderStatistic = {
    data: orderStatistic,
    xField: "date",
    yField: "total",
    seriesField: "status",
    xAxis: {
      type: "time",
    },
    yAxis: {
      label: {
        formatter: (v) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
  };

  const setValueStatis = (res) => {
    let monthSum = 0;
    let monthNumber = 0;
    let dayNumber = 0;
    const arrTmpColumn = [];
    const arrTmpPie = [
      { type: "Processing", value: 0 },
      { type: "Delivering", value: 0 },
      { type: "Completed", value: 0 },
      { type: "Canceled", value: 0 },
      { type: "Return/Refund", value: 0 },
    ];
    for (let i = 0; i < 12; i++) {
      arrTmpColumn.push(
        { month: `Month ${i + 1}`, type: "Processing", value: 0 },
        { month: `Month ${i + 1}`, type: "Delivering", value: 0 },
        { month: `Month ${i + 1}`, type: "Completed", value: 0 },
        { month: `Month ${i + 1}`, type: "Canceled", value: 0 },
        { month: `Month ${i + 1}`, type: "Return/Refund", value: 0 }
      );
    }
    res.map((item, index) => {
      setValueChartPie(arrTmpPie, item);
      if (item.status !== 3) {
        const date_order = new Date(item.created_at);
        const date_now = new Date();
        // console.log(date_now, date_order);
        setthisYear(date_now.getFullYear());
        if (date_order.getDate() === date_now.getDate()) {
          dayNumber++;
        }
        if (date_order.getMonth() === date_now.getMonth()) {
          monthNumber++;
          monthSum += parseInt(item.total_price);
        }

        setValueChartColumn(arrTmpColumn, date_order, date_now, item);
      }
      console.log(res.length)
      if (index === res.length - 1) {
        settotalMonth(monthSum);
        setthisMonthNumber(monthNumber);
        setthisDayNumber(dayNumber);
        setshowContent(true);
      }
    });
  };

  const setValueChartPie = (arrTmp, item) => {
    if (item.status === 0) {
      arrTmp[0].value++;
    } else if (item.status === 1) {
      arrTmp[1].value++;
    } else if (item.status === 2) {
      arrTmp[2].value++;
    } else if (item.status === 3) {
      arrTmp[3].value++;
    } else {
      arrTmp[4].value++;
    }
    setdataChartPie(arrTmp);
  };

  const setValueChartColumn = (arrTmp, date_order, date_now, item) => {
    if (date_order.getFullYear() === date_now.getFullYear()) {
      // console.log(item.status);
      arrTmp.map((e, key) => {
        if (`Month ${date_order.getMonth() + 1}` === e.month) {
          if (item.status === 0 && arrTmp[key] === "Processing") {
            arrTmp[key].value++;
          } else if (item.status === 1 && arrTmp[key] === "Delivering") {
            arrTmp[key].value++;
          } else if (item.status === 2 && arrTmp[key] === "Completed") {
            arrTmp[key].value++;
          } else if (item.status === 3 && arrTmp[key] === "Canceled") {
            arrTmp[key].value++;
          } else {
            arrTmp[key].value++;
          }
        }
      });
    }
    setdataChartColumn(arrTmp);
  };

  const configChartPie = {
    data: dataChartPie,
    angleField: "value",
    colorField: "type",
    radius: 0.75,
    label: {
      type: "spider",
      labelHeight: 28,
      content: "\n{percentage}",
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
  };

  const configTopSaleChart = {
    data: dataTopsaleProduct,
    xField: "sold",
    yField: "product_name",
    barWidthRatio: 0.8,
    meta: {
      type: {
        alias: "product_name",
      },
      sold: {
        alias: "sold",
      },
    },
  };
  const ItemCard = (props) => {
    return (
      <Col xl={6} md={12} xs={24}>
        <Card
          title={props.title}
          style={{
            boxShadow: "2px 0px 30px #00000026",
            borderRadius: 5,
            borderLeft: `5px solid ${props.colorLeft}`,
          }}
        >
          {props.children}
        </Card>
      </Col>
    );
  };

  const Top = () => {
    return (
      <Row
        gutter={[
          { xl: 30, md: 30 },
          { md: 20, sm: 20, xs: 20 },
        ]}
      >
        <Col xl={6} md={12} xs={24}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontWeight: "bold", fontSize: 18, marginRight: 10 }}
              >{`${sessionTime}`}</span>
              <Image src={logoSessionTime} width={80} preview={false} />
            </div>
            <span>
              This is a statistical overview that can help you see how your
              business is performing !
            </span>
          </div>
        </Col>
        <ItemCard title="Number of orders this month" colorLeft="red">
          <span
            style={{ fontWeight: "bold" }}
          >{`${thisMonthNumber} order`}</span>
        </ItemCard>
        <ItemCard title="Amount sold this month" colorLeft="blue">
          <span style={{ fontWeight: "bold" }}>{`${formatdolla(
            totalMonth,
            "$"
          )}`}</span>
        </ItemCard>
        <ItemCard title="Order number today" colorLeft="green">
          <span style={{ fontWeight: "bold" }}>{`${thisDayNumber} order`}</span>
        </ItemCard>
      </Row>
    );
  };
  return (
    <>
      <div className="container-fluid">
        {showContent ? (
          <div>
            {Top()}
            <div className="mt-3 rounded">
              <div className="d-flex justify-content-between">
                <h5 className="mb-3">Overview chart</h5>
                <div className="d-flex align-items-center">
                  <RangePicker
                    value={[
                      dayjs(filter.start, "YYYY-MM-DD"),
                      dayjs(filter.end, "YYYY-MM-DD"),
                    ]}
                    onChange={(e) => {
                      setFilter((current) => ({
                        ...current,
                        start: dayjs(new Date(e[0].$d)).format("YYYY-MM-DD"),
                        end: dayjs(new Date(e[1].$d)).format("YYYY-MM-DD"),
                      }));
                    }}
                  />
                  <button
                    className="mx-2 btn btn-info rounded"
                    onClick={() => {
                      getAllOrder();
                      getTopsaleProduct();
                      getOrderStatistic();
                    }}
                  >
                    Show
                  </button>
                  <button
                    className="btn btn-info rounded"
                    onClick={() => {
                      setFilter((current) => ({
                        ...current,
                        start: dayjs(new Date())
                          .startOf("M")
                          .format("YYYY-MM-DD"),
                        end: dayjs(new Date())
                          .endOf("M")
                          .format("YYYY-MM-DD"),
                      }));
                      setIsReload(true);
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12 mb-3">
                  <div
                    className="p-3 rounded bg-white"
                    style={{ boxShadow: "2px 0px 30px #00000026" }}
                  >
                    <h6 className="mb-3 text-center">{`Top sale 10 product from ${filter.start} to ${filter.end}`}</h6>
                    <Button
                      className="mb-2"
                      onClick={() => refBar.current?.downloadImage()}
                    >
                      <DownloadOutlined />
                    </Button>
                    <Bar
                      {...configTopSaleChart}
                      onReady={(plot) => {
                        refBar.current = plot;
                      }}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div
                    className="p-3 rounded bg-white"
                    style={{ boxShadow: "2px 0px 30px #00000026" }}
                  >
                    <h6 className="mb-3 text-center">{`Order statictis from ${filter.start} to ${filter.end}`}</h6>
                    <Button
                      className="mb-2"
                      onClick={() => refLine.current?.downloadImage()}
                    >
                      <DownloadOutlined />
                    </Button>
                    <Line
                      {...configOrderStatistic}
                      onReady={(plot) => {
                        refLine.current = plot;
                      }}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div
                    className="p-3 rounded bg-white"
                    style={{ boxShadow: "2px 0px 30px #00000026" }}
                  >
                    <h6 className="mb-3 text-center">{`Order statictis from ${filter.start} to ${filter.end}`}</h6>
                    <Button
                      className="mb-2"
                      onClick={() => refPie.current?.downloadImage()}
                    >
                      <DownloadOutlined />
                    </Button>
                    <Pie
                      {...configChartPie}
                      onReady={(plot) => {
                        refPie.current = plot;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Spinner spinning={!showContent} />
        )}
      </div>
    </>
  );
}
