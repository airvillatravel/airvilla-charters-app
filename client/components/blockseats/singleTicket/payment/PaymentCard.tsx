"use client";
import { useState } from "react";
import Image from "next/image";
import visa from "@/public/images/element/visa.svg";
import masterCard from "@/public/images/element/mastercard.svg";
import expressCard from "@/public/images/element/expresscard.svg";

export default function PaymentCard() {
  const [cardNumber, setCardNumber] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  return (
    <div className="mx-auto">
      <h1
        className="text-5xl font-bold mb-0 text-gray-900 dark:text-white my-6 py-6"
        style={{ fontSize: "calc(1.425rem + 2vw)" }}
      >
        Enter Your Payment Details
      </h1>

      <div className="bg-green-100 dark:bg-green-400/15 border border-green-800 p-4 rounded-md mt-4 mb-6">
        <p className="text-green-700 dark:text-green-500">
          Hey! you are saving $2,560 discount using coupon code
        </p>
      </div>

      <div className="mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="mb-6 sm:flex sm:justify-between items-center">
          <p className="mb-2 font-inter font-bold leading-5 text-lg text-gray-700 dark:text-white">
            We Accept:
          </p>
          <div className="flex">
            <ul className="list-none pl-0 mb-0 space-x-2">
              <li className="inline-block">
                <a href="#">
                  <Image
                    src={visa}
                    width={47.4}
                    height={30}
                    alt="visa"
                    style={{ width: "47.4px", height: "30px" }}
                  />
                </a>
              </li>
              <li className="inline-block">
                <a href="#">
                  <Image
                    src={masterCard}
                    width={47.4}
                    height={30}
                    alt="masterCard"
                    style={{ width: "47.4px", height: "30px" }}
                  />
                </a>
              </li>
              <li className="inline-block">
                <a href="#">
                  <Image
                    src={expressCard}
                    width={47.4}
                    height={30}
                    alt="expressCard"
                    style={{ width: "47.4px", height: "auto" }}
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <form>
          <div className="mb-4">
            <label
              htmlFor="cardNumber"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Card Number *
            </label>
            <input
              type="text"
              id="cardNumber"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="XXXX XXXX XXXX XXXX"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row mb-4 md:space-x-4">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <label
                htmlFor="expirationDate"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Expiration date *
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="expirationMonth"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-s-md focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Month"
                  value={expirationMonth}
                  onChange={(e) => setExpirationMonth(e.target.value)}
                  required
                />
                <input
                  type="text"
                  id="expirationYear"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-e-md focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Year"
                  value={expirationYear}
                  onChange={(e) => setExpirationYear(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <label
                htmlFor="cvv"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                CVV / CVC *
              </label>
              <input
                type="text"
                id="cvv"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="XXX"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="nameOnCard"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name on Card *
            </label>
            <input
              type="text"
              id="nameOnCard"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter card holder name"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-opacity-50"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}
