const testId = (testId: string) => cy.get(`[data-testid="${testId}"]`);

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const pad = (n: number) => String(n).padStart(2, "0");

const toDateInputValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const toDateTimeInputValue = (date: Date) =>
  `${toDateInputValue(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

describe("user journey", () => {
  const trackerName = `E2E Tracker ${Date.now()}`;
  const categoryTrackerName = `E2E Category Tracker ${Date.now()}`;

  it("creates, uses and deletes a counter tracker", () => {
    // 1. Dashboard: create a counter tracker
    openDashboard();
    createTracker(trackerName, "counter");
    trackerCard().should("exist");

    // 2. Create an event from the dashboard card (timestamp: now)
    addEventToCard(5);
    assertCardSummary("5");

    // 3. Detail page with event from before visible
    openTrackerDetail();
    openEventsTab();
    assertEventList("delta: 5");
    openStatsTab();
    assertTotalStat("5");

    // 4. Widen the date range so that an older event will be included too
    setDateRange(daysFromNow(-14), new Date());
    assertTotalStat("5");

    // 5. Create a second event inside the details view. (timestamped 10 days ago)
    addEventFromDetailView(3, daysFromNow(-10));
    assertTotalStat("8");

    // 7. Both events are listed in the events tab (newest first)
    openEventsTab();
    assertEventList("delta: 5", "delta: 3");

    // 8. Narrow the date range again to exclude event from 10 days ago
    setDateRange(daysFromNow(-7), new Date());
    assertEventList("delta: 5");
    openStatsTab();
    assertTotalStat("5");

    // 9. Delete the tracker (cleanup)
    deleteTracker();
    assertTrackerGone();
  });

  it("creates, uses and deletes a category tracker", () => {
    // 1. Dashboard: create a category tracker
    openDashboard();
    createTracker(categoryTrackerName, "category");
    trackerCard(categoryTrackerName).should("exist");

    // 2. Create an event from the dashboard card (category: Food, amount: 5)
    addCategoryEventToCard("Food", 5);

    // 3. Detail page with event from before visible (stats tab is shown by default)
    openTrackerDetail(categoryTrackerName);
    assertTotalStat("5");

    // 4. Create a second event inside the details view (category: Fun, amount: 3, timestamp: now)
    addCategoryEventFromDetailView("Fun", 3, daysFromNow(-1));
    assertTotalStat("8");

    // 5. Both events are listed in the events tab (newest first)
    openEventsTab();
    assertEventList("category: Food", "category: Fun");
    assertEventList("amount: 5", "amount: 3");

    // 6. Delete the tracker (cleanup)
    deleteTracker();
    assertTrackerGone(categoryTrackerName);
  });

  const trackerCard = (name: string = trackerName) =>
    testId("tracker-card")
      .contains("h3", name)
      .closest('[data-testid="tracker-card"]');

  const openDashboard = () => {
    cy.visit("/");
    testId("title").should("contain.text", "Track Thing");
    testId("add-tracker-button").should("be.visible");
  };

  const createTracker = (name: string, type: string) => {
    testId("add-tracker-button").click();
    testId("add-tracker-dialog").within(() => {
      cy.contains("h3", "Add Tracker");
      testId("tracker-name-input").type(name);
      testId("tracker-type-select").select(type);
      testId("tracker-form-submit").should("not.be.disabled").click();
    });
  };

  const addEventToCard = (delta: number) => {
    trackerCard().find('[data-testid="add-event-button"]').click();
    testId("add-event-dialog").within(() => {
      cy.contains("h3", `Add Event: ${trackerName}`);
      testId("event-delta-input").clear().type(String(delta));
      testId("event-form-submit").click();
    });
  };

  const addCategoryEventToCard = (category: string, amount: number) => {
    trackerCard(categoryTrackerName)
      .find('[data-testid="add-event-button"]')
      .click();
    testId("add-event-dialog").within(() => {
      cy.contains("h3", `Add Event: ${categoryTrackerName}`);
      testId("event-category-input").clear().type(category);
      testId("event-amount-input").clear().type(String(amount));
      testId("event-form-submit").click();
    });
  };

  const assertCardSummary = (total: string) => {
    trackerCard()
      .find('[data-testid="tracker-summary-number"]')
      .should("contain.text", total);
  };

  const openTrackerDetail = (name: string = trackerName) => {
    trackerCard(name).find('[data-testid="view-tracker-button"]').click();
    cy.location("pathname").should("match", /^\/tracker\//);
    cy.contains("h2", `Tracker: ${name}`).should("be.visible");
  };

  const openEventsTab = () => {
    testId("tab-events").click();
    testId("tab-events").should("have.class", "selected-tab");
  };

  const openStatsTab = () => {
    testId("tab-stats").click();
    testId("tab-stats").should("have.class", "selected-tab");
  };

  const assertTotalStat = (total: string) => {
    testId("stats-total").should("contain.text", total);
  };

  const assertEventList = (...texts: string[]) => {
    const events = () =>
      cy.get('article[data-testid^="event-"]', { timeout: 15_000 });
    events().should("have.length", texts.length);
    texts.forEach((text, index) => {
      events().eq(index).should("contain.text", text);
    });
  };

  const setDateRange = (from: Date, to: Date) => {
    for (const [testIdName, date] of [
      ["date-range-from", from],
      ["date-range-to", to],
    ] as const) {
      testId(testIdName)
        .invoke("val", toDateInputValue(date))
        .trigger("input")
        .trigger("change");
    }
  };

  const addEventFromDetailView = (delta: number, timestamp?: Date) => {
    testId("add-event-button").click();
    testId("add-event-dialog").within(() => {
      cy.contains("h3", `Add Event: ${trackerName}`);
      if (timestamp) {
        testId("event-timestamp-input")
          .invoke("val", toDateTimeInputValue(timestamp))
          .trigger("input");
      }
      testId("event-delta-input").clear().type(String(delta));
      testId("event-form-submit").should("not.be.disabled").click();
    });
  };

  const addCategoryEventFromDetailView = (
    category: string,
    amount: number,
    timestamp?: Date,
  ) => {
    testId("add-event-button").click();
    testId("add-event-dialog").within(() => {
      cy.contains("h3", `Add Event: ${categoryTrackerName}`);
      if (timestamp) {
        testId("event-timestamp-input")
          .invoke("val", toDateTimeInputValue(timestamp))
          .trigger("input");
      }
      testId("event-category-input").clear().type(category);
      testId("event-amount-input").clear().type(String(amount));
      testId("event-form-submit").should("not.be.disabled").click();
    });
  };

  const deleteTracker = () => {
    testId("delete-tracker-button").click();
    testId("delete-tracker-confirm-dialog").within(() => {
      cy.contains("h3", "Confirm Deletion");
      testId("confirm-button").click();
    });
  };

  const assertTrackerGone = (name: string = trackerName) => {
    cy.get("h2", { timeout: 15_000 }).should("contain.text", "Trackers");
    cy.get("main").should(($main) => {
      expect($main.text()).to.not.contain(name);
    });
  };
});
