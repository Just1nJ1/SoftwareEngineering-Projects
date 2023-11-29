describe("Order Page Tests", () => {
    let dom;
    let document;

    beforeEach(() => {
        // Set up jsdom
        dom = new JSDOM(`<!DOCTYPE html><html><body>
            <table id="orderTable">
                <tbody></tbody>
            </table>
            <script src="/js/order.js"></script>
        </body></html>`);
        document = dom.window.document;
        global.window = dom.window;
        global.fetch = jasmine.createSpy('fetch').and.callFake(() => Promise.resolve({
            json: () => Promise.resolve([{ /* mock order data */ }])
        }));
    });

    afterEach(() => {
        global.window = undefined;
        global.fetch = undefined;
    });

    it("should populate orders on page load", (done) => {
        require('../public/js/order.js');

        setTimeout(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/order');
            done();
        }, 10);
    });
});
