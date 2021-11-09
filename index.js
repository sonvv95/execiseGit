import { PayCircleOutlined } from "@ant-design/icons";
import { fetchOrders } from "actions";
import { fetchCollectMoneys } from "actions/order";
import { Button, DatePicker, Input, Modal, Radio, Select, Table } from "antd";
import CustomerSearch from "components/CustomerSearch";
import SearchBar from "components/SearchBar";
import hocs from "hocs/whoami";
import { cloneDeep } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { accountList, formatDate, formatMoney } from "tools";
import TransactionDetail from "../TransactionDetail";
import { fetchTransactions } from "actions";

const { Option } = Select;

const defautTransaction = {
  items: [],
  type: 2,
  is_receipts: true,
  status: 0,
  accounting_date: moment(),
  vouchers_date: moment(),
  customer: {},
};

const OrderCollectMoney = ({
  usersBusinesses,
  accounts,
  orders,
  businessId,
  collectMoneys,
  fetchOrders,
}) => {
  const [collectMoney, setCollectMoney] = useState({});
  console.log("collectMoney: ",collectMoney)  
  const [loading, setLoading] = useState(true);
  const [searchCustomerResult, setSearchCustomerResult] = useState([]);
  const [customerId, setCustomerId] = useState(123);
  const windowWidth = (process.browser && window?.innerWidth) || 1200;
  const tableWidth = 0.9 * windowWidth - 52;
  const [visibleCollectMoney, setVisibleCollectMoney] = useState(false);

  const collectMoneyData = {
    items: [
      {
        description: "Thu tiền theo hóa đơn",
        amount: collectMoney.proceeds,
        credit_account: "131",
        debit_account:
          collectMoney.payment_method === "cash_in_bank" ? "1121" : "1111",
      },
    ],
    type: 2,
    is_receipts: true,
    status: 0,
    accounting_date: moment(),
    vouchers_date: moment(),
    bill_phone_number: "",
    address: "hà nội",
    customer: { name: collectMoney.customer },
  };

  const data = ()=>{
    const collectMoneyData = [];
    orders.data.map(v=>{
      collectMoneyData.push({
        items: [
          {
            description: "Thu tiền theo hóa đơn",
            amount: collectMoney.proceeds,
            credit_account: "131",
            debit_account:
              collectMoney.payment_method === "cash_in_bank" ? "1121" : "1111",
          },
        ],
        type: 2,
        is_receipts: true,
        status: 0,
        accounting_date: moment(),
        vouchers_date: moment(),
        // bill_phone_number: v.data.map(value=>value.display_id),
        // address: v.data.map(value=>value.customer.address),
        // customer: { name: collectMoney.customer },
      })
    })
    return collectMoneyData
  }

  const [state, setState] = useState({
    visible: false,
    transactionData: defautTransaction,
  });

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
      );
      return selectedRowKeys
    },
  };

  useEffect(() => {
    fetchCollectMoneys(businessId);
  }, [loading]);

  const handleCollectMoneyChange = (key, value) => {
    let oldCollectMoney = cloneDeep(collectMoney);
    oldCollectMoney[key] = value;
    setCollectMoney(oldCollectMoney);
  };

  const handleSync = () => {
    fetchCollectMoneys(businessId);
  };

  const _fetchOrders = () => {
    setLoading(true);
    let dataFilter = { customer_id: customerId };
    fetchOrders(businessId, dataFilter).then((_) => {
      setLoading(false);
    });
  };

  const columns = [
    {
      title: "Ngày chứng từ",
      dataIndex: "voucher_date",
      width: 0.05 * tableWidth,
    },
    {
      title: "Số chứng từ",
      dataIndex: "voucher_number",
      width: 0.05 * tableWidth,
    },
    {
      title: "Số hóa đơn",
      dataIndex: "bill_number",
      width: 0.05 * tableWidth,
    },
    {
      title: "Diễn giải",
      dataIndex: "interpretations",
      width: 0.05 * tableWidth,
    },
    {
      title: "Hạn thanh toán",
      dataIndex: "payment_term",
      width: 0.05 * tableWidth,
    },
    {
      title: "Số phải thu",
      dataIndex: "amount_due",
      width: 0.05 * tableWidth,
    },
    {
      title: "Số chưa thu",
      dataIndex: "amount_not_yet_collected",
      width: 0.05 * tableWidth,
    },
    {
      title: "Số thu",
      dataIndex: "Proceeds",
      width: 0.05 * tableWidth,
      // render: ({ value ,index }) => {
      //   return (
      //     <BoxInputNumber
      //       value={value}
      //       currency={"VND"}
      //       size="small"
      //       isMoney={true}
      //       min={0}
      //       callBack={formatValue => handleCollectMoneyChange('Proceeds', index, formatValue)}
      //       suffix={getCurrencySymbol('VND')}
      //     />
      //   )
      // }
      render: ({ value, index }) => {
        return (
          <Input
            defaultValue={
              collectMoney.number_obtained
                ? Number(collectMoney.number_obtained)
                : 0
            }
            onChange={(e) =>
              handleCollectMoneyChange("proceeds", e.target.value, index)
            }
            value={value}
          />
        );
      },
    },
    {
      title: "TK phải thu",
      dataIndex: "accounts_receivable",
      width: 0.05 * tableWidth,
    },
    {
      title: "Điều khoản TT",
      dataIndex: "terms_of_payment",
      width: 0.05 * tableWidth,
    },
    {
      title: "Tỷ lệ CK (%)",
      dataIndex: "discount_rate",
      width: 0.05 * tableWidth,
    },
    {
      title: "Tiền chiết khấu",
      dataIndex: "discount_rate",
      width: 0.05 * tableWidth,
    },
    {
      title: "TK chiết khấu",
      dataIndex: "discount_account",
      width: 0.05 * tableWidth,
      render: (value, index) => {
        return (
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn TK"
            value={collectMoney.value}
            size="small"
            onChange={(value) =>
              handleCollectMoneyChange("discount_account", value)
            }
            optionLabelProp="label"
            dropdownMatchSelectWidth={false}
          >
            {accountList(
              accounts,
              [
                "current_asset",
                "long_term_asset",
                "liabilities",
                "resources",
                "revenue",
                "cost",
                "other_income",
                "other_expense",
                "business_result",
              ],
              []
            )
              .filter((v) => {
                if (v.is_parent !== true) return v;
              })
              .map((account) => {
                return (
                  <Option
                    key={account.account_number}
                    label={account.account_number}
                  >
                    <span style={{ fontWeight: 600, marginRight: 15 }}>
                      {account.account_number}
                    </span>
                    <span>{account.account_name}</span>
                  </Option>
                );
              })}
          </Select>
        );
      },
    },
  ];

  const getData = (orders) => {
    const data = [];
    orders.data.map((v, index) => {
      data.push({
        key: v.id || index,
        voucher_date: formatDate(v.debit.vouchers_date),
        voucher_number: v.debit.custom_id,
        bill_number: "acb",
        interpretations: v.debit.note,
        payment_term: "abc",
        amount_due: formatMoney(v.customer.current_collect_debts),
        amount_not_yet_collected: formatMoney(v.customer.current_pay_debts),
        // Proceeds: (
        //   <Input
        //     defaultValue={
        //       collectMoney.number_obtained
        //         ? Number(collectMoney.number_obtained)
        //         : 0
        //     }
        //     onChange={(e) =>
        //       handleCollectMoneyChange("proceeds", e.target.value)
        //     }
        //     value={collectMoney.proceeds}
        //   />
        // ),
        Proceeds: { value: collectMoney.proceeds || 0, index: index },
        accounts_receivable: v.items.map((item) => item.debt_account),
        terms_of_payment: "",
        discount_rate: "",
        discount_rate: "",
      });
    });
    return data;
  };

  const handleRowClick = () => {
    setState({ visible: true, transactionData: collectMoneyData });
  };

  const handleSelectCustomer = (selectedId) => {
    const customer = searchCustomerResult.find((c) => c.id == selectedId);
    const cloneData = cloneDeep(collectMoneys);
    cloneData.customer = customer;
    cloneData.customer_name = customer.name;
    cloneData.customer_id = selectedId;
  };

  const handleCloseModal = () => {
    setVisibleCollectMoney(false);
  };

  const handleCollectMoney = () => {
    setState({ visible: true, transactionData: collectMoneyData });
  };

  const renderTableFooter = (column, orders) => {
    if (typeof document == "undefined") return;
    let totalPrice = 0;
    getData(orders).forEach(({ Proceeds }) => {
      totalPrice += Proceeds;
    });

    return (
      <div className="sum-row" style={{ display: "flex" }}>
        <div style={{ display: "-webkit-box" }}>
          {column.map((col, index) => {
            let width = col.width;
            if (col.dataIndex == "discount_account") {
              return (
                <div
                  key={index}
                  style={{
                    width: width,
                    padding: "6px 8px",
                    textAlign: "right",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <strong>
                    {collectMoney.proceeds
                      ? formatMoney(collectMoney.proceeds)
                      : 0}
                  </strong>
                </div>
              );
            }
            if (col.dataIndex == "voucher_date") {
              return (
                <div
                  style={{
                    width: width,
                    padding: "6px 0px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <strong>Tổng thu</strong>
                </div>
              );
            }
            return (
              <div key={index} style={{ width: width }}>
                <span> </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <div>
      <Button
        icon={<PayCircleOutlined />}
        onClick={() => setVisibleCollectMoney(true)}
      >
        Thu tiền
      </Button>
      <Modal
        centered
        visible={visibleCollectMoney}
        onOk={handleCollectMoney}
        onCancel={handleCloseModal}
        width="95%"
        okText="Thu tiền"
        cancelText="Hủy"
        className="custom-collect_money-modal"
        title="Thu tiền theo hóa đơn"
      >
        <div className="order-collect-money-container">
          <div style={{ display: "flex" }}>
            <div style={{ width: "50%" }}>
              <div style={{ display: "flex", marginBottom: 20 }}>
                <div style={{ display: "inline", marginRight: 15 }}>
                  Phương thức thanh toán
                </div>
                <div style={{ displayL: "inline" }}>
                  <Radio.Group
                    value={collectMoney.payment_method}
                    onChange={(e) =>
                      handleCollectMoneyChange("payment_method", e.target.value)
                    }
                  >
                    <Radio value="cash">Tiền mặt</Radio>
                    <Radio value="cash_in_bank">Tiền gửi</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div style={{ fontWeight: 600, width: "100%", display: "flex" }}>
                <span style={{ width: "13%" }}>Khách hàng</span>
                <div style={{ width: "57%", marginTop: -3 }}>
                  <CustomerSearch
                    onSelect={handleSelectCustomer}
                    searchResult={searchCustomerResult}
                    businessId={businessId}
                    callback={(searchCustomerResult) =>
                      setSearchCustomerResult(searchCustomerResult)
                    }
                    onChange={(e) =>
                      handleCollectMoneyChange("payment_method", e.target.value)
                    }
                    value={collectMoney.customer}
                  />
                </div>
              </div>
              <div style={{ marginTop: 15, display: "flex", fontWeight: 600 }}>
                <div style={{ width: "40%", paddingRight: 10 }}>
                  <div>Nhân viên bán hàng</div>
                  <Select
                    onChange={(value) =>
                      handleCollectMoneyChange("staff", value)
                    }
                    value={collectMoney.staff}
                    placeholder="Chọn nhân viên"
                    style={{ width: "100%" }}
                  >
                    {usersBusinesses.map((user) => {
                      return <Option key={user.id}>{user.user.name}</Option>;
                    })}
                  </Select>
                </div>
                <div style={{ width: "30%" }}>
                  <div>Ngày thu tiền</div>
                  <DatePicker
                    showToday={true}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày"
                    onChange={(date) =>
                      handleCollectMoneyChange("collection_date", date)
                    }
                    value={moment(collectMoney.collection_date)}
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ width: "10%", paddingLeft: 20 }}>
                  <br />
                  <Button type="primary" onClick={_fetchOrders}>
                    Lấy dữ liệu
                  </Button>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "end", marginTop: 40, width: "50%" }}>
              <span
                style={{
                  textAlign: "end",
                  fontSize: "larger",
                }}
              >
                Số thu
              </span>
              <div style={{ fontSize: 35, fontWeight: 600 }}>
                {collectMoney.proceeds ? formatMoney(collectMoney.proceeds) : 0}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 15, marginBottom: 15 }}>
            <div style={{ flex: 1, fontWeight: 600 }}>
              <span>Chứng từ công nợ</span>
              <div style={{ width: "70%" }}>
                <SearchBar
                  // callBackSearch={(obj) => this.fetchPurchases(obj)}
                  placeholder="Tìm theo số chứng từ, số hóa đơn"
                />
              </div>
            </div>
            <div style={{ flex: 1, textAlign: "end", fontWeight: 600 }}>
              <span style={{ marginRight: 20 }}>Nhập số thu</span>
              <Input
                style={{ width: "20%" }}
                onChange={(e) =>
                  handleCollectMoneyChange("number_obtained", e.target.value)
                }
                value={collectMoney.number_obtained}
              />
            </div>
          </div>
          <Table
            columns={columns}
            rowSelection={rowSelection}
            dataSource={getData(orders)}
            onRow={(record) => ({
              onClick: (e) => handleRowClick(record),
            })}
            scroll={{ y: 200 }}
            pagination={false}
            bordered
            footer={() => renderTableFooter(columns, orders)}
          />
          <TransactionDetail
            visible={state.visible}
            transactionData={state.transactionData}
            callBack={(changes) => {
              // console.log('changes', changes);
              setState({ ...state, ...changes });
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default connect(
  ({ customer, user, product, order }) => ({
    customers: customer.customers,
    usersBusinesses: user.users,
    accounts: product.accounts,
    orders: order.orders,
    collectMoneys: order.collectMoneys,
  }),
  { fetchOrders }
)(hocs(OrderCollectMoney));
