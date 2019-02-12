"use strict"
const assert = require("assert")
const assert2 = require("chai").assert
const slp = require("./../lib/SLP").default
const SLP = new slp()
const nock = require("nock") // http call mocking

// Mock data used for unit tests
const mockData = require("./fixtures/mock-utils")

// Default to unit tests unless some other value for TEST is passed.
if (!process.env.TEST) process.env.TEST = "unit"
const SERVER = "https://rest.bitcoin.com"

// Used for debugging and iterrogating JS objects.
const util = require("util")
util.inspect.defaultOptions = { depth: 1 }

describe("#Utils", () => {
  beforeEach(() => {
    // Activate nock if it's inactive.
    if (!nock.isActive()) nock.activate()
  })

  afterEach(() => {
    // Clean up HTTP mocks.
    nock.cleanAll() // clear interceptor list.
    nock.restore()
  })

  describe("#list", () => {
    it(`should list all SLP tokens`, async () => {
      // Mock the call to rest.bitcoin.com
      if (process.env.TEST === "unit") {
        nock(SERVER)
          .get(uri => uri.includes("/"))
          .reply(200, mockData.mockList)
      }

      const list = await SLP.Utils.list()
      //console.log(`list: ${JSON.stringify(list, null, 2)}`)

      assert2.isArray(list)
      assert2.hasAllKeys(list[0], [
        "id",
        "timestamp",
        "symbol",
        "name",
        "documentUri",
        "documentHash",
        "decimals",
        "initialTokenQty"
      ])
    })

    it(`should list single SLP token by id: 4276533bb702e7f8c9afd8aa61ebf016e95011dc3d54e55faa847ac1dd461e84`, async () => {
      try {
        const list = await SLP.Utils.list(
          "4276533bb702e7f8c9afd8aa61ebf016e95011dc3d54e55faa847ac1dd461e84"
        )
        assert.deepEqual(Object.keys(list), [
          "id",
          "timestamp",
          "symbol",
          "name",
          "documentUri",
          "documentHash",
          "decimals",
          "initialTokenQty"
        ])
      } catch (error) {
        throw error
      }
    })
  })

  describe("#balancesForAddress", () => {
    it(`should fetch all balances for address: simpleledger:qzv3zz2trz0xgp6a96lu4m6vp2nkwag0kvyucjzqt9`, async () => {
      try {
        const balances = await SLP.Utils.balancesForAddress(
          "simpleledger:qzv3zz2trz0xgp6a96lu4m6vp2nkwag0kvyucjzqt9"
        )
        //console.log(`balances: ${JSON.stringify(balances, null, 2)}`)

        assert2.isArray(balances)
        assert2.hasAllKeys(balances[0], ["tokenId", "balance", "decimalCount"])
      } catch (error) {
        throw error
      }
    })
  })

  describe("#balance", () => {
    it(`should fetch balance of single token for address: simpleledger:qzv3zz2trz0xgp6a96lu4m6vp2nkwag0kvyucjzqt9`, async () => {
      try {
        const balance = await SLP.Utils.balance(
          "simpleledger:qzv3zz2trz0xgp6a96lu4m6vp2nkwag0kvyucjzqt9",
          "df808a41672a0a0ae6475b44f272a107bc9961b90f29dc918d71301f24fe92fb"
        )

        const data = {
          tokenId:
            "df808a41672a0a0ae6475b44f272a107bc9961b90f29dc918d71301f24fe92fb",
          balance: "1",
          decimalCount: 8
        }
        assert.deepEqual(balance, data)
      } catch (error) {
        throw error
      }
    })
  })

  describe("#validateTxid", () => {
    it(`should validate slp txid`, async () => {
      try {
        const isValid = await SLP.Utils.validateTxid(
          "df808a41672a0a0ae6475b44f272a107bc9961b90f29dc918d71301f24fe92fb",
          "mainnet"
        )
        assert.equal(isValid, true)
      } catch (error) {
        throw error
      }
    })
  })
})
