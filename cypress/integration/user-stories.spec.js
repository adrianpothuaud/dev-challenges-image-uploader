describe("When I open My Image Uploader", () => {
  describe("And I choose an image from my folder", () => {
    before(() => {
      cy.visit("/", {
        onBeforeLoad(win) {
          cy.spy(win.navigator.clipboard, "writeText").as("copy")
        }
      })
      cy.get("[data-cy=hiddenInput]").attachFile("dice_1.png")
    })
    it("I can see a loader", () => {
      cy.get("[data-cy=uploadingCard]").should("be.visible")
      cy.get("[data-cy=loaderBar]").should("be.visible")
      cy.get("[data-cy=loaderItem]").should("be.visible")
    })
    it("And the image is uploaded", () => {
      cy.get("[data-cy=uploadedCard]").should("be.visible")
      cy.get("[data-cy=uploadedImage]").should("be.visible")
    })
    it("And I can choose to copy to the clipboard", () => {
      cy.get("[data-cy=copyButton]").should("be.visible")
      cy.get("[data-cy=copyButton]").click()
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          assert.match(
            text,
            new RegExp(/^(.*)api.cloudinary.com(.*)/, "i")
          )
        })
      })
    })
  })
  describe("And I drag and drop an image", () => {
    before(() => {
      cy.visit("/", {
        onBeforeLoad(win) {
          cy.spy(win.navigator.clipboard, "writeText").as("copy")
        }
      })
      cy.get("[data-cy=dragArea]").attachFile(
        "dice_1.png",
        {subjectType: "drag-n-drop"}
      )
    })
    it("I can see a loader", () => {
      cy.get("[data-cy=uploadingCard]").should("be.visible")
      cy.get("[data-cy=loaderBar]").should("be.visible")
      cy.get("[data-cy=loaderItem]").should("be.visible")
    })
    it("And the image is uploaded", () => {
      cy.get("[data-cy=uploadedCard]").should("be.visible")
      cy.get("[data-cy=uploadedImage]").should("be.visible")
    })
    it("And I can choose to copy to the clipboard", () => {
      cy.get("[data-cy=copyButton]").should("be.visible")
      cy.get("[data-cy=copyButton]").click()
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          assert.match(
            text,
            new RegExp(/^(.*)api.cloudinary.com(.*)/, "i")
          )
        })
      })
    })
  })
})
