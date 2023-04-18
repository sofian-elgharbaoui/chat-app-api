const fetch = require("node-fetch");
require("dotenv").config();

const endpoint_url =
  process.env.ENVIRONMENT === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

/**
 * Creates an order and returns it as a JSON response.
 * @function
 * @name createOrder
 * @memberof module:routes
 * @param {object} req - The HTTP request object.
 * @param {object} req.body - The request body containing the order information.
 * @param {string} req.body.intent - The intent of the order.
 * @param {object} res - The HTTP response object.
 * @returns {object} The created order as a JSON response.
 * @throws {Error} If there is an error creating the order.
 */
const createOrder = async (req, res) => {
  const { CLIENT_ID, CLIENT_SECRET, price, intent } = req.body;
  get_access_token(CLIENT_ID, CLIENT_SECRET)
    .then((access_token) => {
      let order_data_json = {
        intent: intent.toUpperCase(),
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: String(price),
            },
          },
        ],
      };
      const data = JSON.stringify(order_data_json);

      fetch(endpoint_url + "/v2/checkout/orders", {
        //https://developer.paypal.com/docs/api/orders/v2/#orders_create
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: data,
      })
        .then((res) => res.json())
        .then((json) => {
          res.send(json);
        }); //Send minimal data to client
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

/**
 * Completes an order and returns it as a JSON response.
 * @function
 * @name completeOrder
 * @memberof module:routes
 * @param {object} req - The HTTP request object.
 * @param {object} req.body - The request body containing the order ID and intent.
 * @param {string} req.body.order_id - The ID of the order to complete.
 * @param {string} req.body.intent - The intent of the order.
 * @param {object} res - The HTTP response object.
 * @returns {object} The completed order as a JSON response.
 * @throws {Error} If there is an error completing the order.
 */
const completeOrder = async (req, res) => {
  const { order_id, intent } = req.body;
  get_access_token()
    .then((access_token) => {
      fetch(endpoint_url + "/v2/checkout/orders/" + order_id + "/" + intent, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          res.send(json);
        }); //Send minimal data to client
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

function get_access_token(client_id, client_secret) {
  const auth = `${client_id}:${client_secret}`;
  const data = "grant_type=client_credentials";
  return fetch(endpoint_url + "/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(auth).toString("base64")}`,
    },
    body: data,
  })
    .then((res) => res.json())
    .then((json) => {
      return json.access_token;
    });
}

module.exports = { createOrder, completeOrder };
