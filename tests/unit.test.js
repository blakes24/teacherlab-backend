"use strict";

const db = require("../db.js");
const Unit = require("../models/unit.js");
const {
  seedDatabase,
  rollbackTransaction,
  endTransaction,
} = require("./testSetup");

beforeEach(seedDatabase);
afterEach(rollbackTransaction);
afterAll(endTransaction);

const unitData = {
  subjectId: 1,
  number: 1,
  title: "Test",
  startDate: "2021-03-25",
  endDate: "2021-04-25",
  reviewDate: "2021-04-28",
};

const updateData = {
  startDate: "2021-03-25",
  endDate: "2021-04-25",
  reviewDate: "2021-04-28",
  completed: true,
  planning: {
    objectives: "Teach stuff",
  },
  collaboration: {
    reflection: "Students learned stuff",
  },
};

/************************************** create unit */

describe("create unit", function () {
  test("works", async function () {
    const unit = await Unit.create(unitData);
    expect(unit).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        subjectId: 1,
        number: 1,
        title: "Test",
        startDate: "2021-03-25",
      })
    );
  });
});

describe("update unit", function () {
  beforeEach(async () => {
    await Unit.create(unitData);
  });

  test("works", async function () {
    const unit = await Unit.update(updateData, 1);
    expect(unit).toEqual(
      expect.objectContaining({
        subjectId: 1,
        number: 1,
        title: "Test",
        completed: true,
        startDate: "2021-03-25",
        planning: {
          objectives: "Teach stuff",
        },
        collaboration: {
          reflection: "Students learned stuff",
        },
      })
    );
  });
});

describe("get unit", function () {
  beforeEach(async () => {
    await Unit.create(unitData);
  });

  test("works", async function () {
    const unit = await Unit.get(1);
    expect(unit).toEqual(
      expect.objectContaining({
        subjectId: 1,
        number: 1,
        title: "Test",
        completed: false,
        startDate: "2021-03-25",
        planning: {},
        collaboration: {},
      })
    );
  });
});
