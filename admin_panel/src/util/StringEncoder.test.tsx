import {escapeExclaimsAndSlashes} from "./StringEncoder";


describe("escapeExclaimsAndSlashes", () => {



    it("handles test 1", () => {
        const input = "!!!!";
        const expected = "!!!!!!!!";

        const actual = escapeExclaimsAndSlashes(input);
        expect(actual).toEqual(expected);

    });

    it("handles test 2", () => {
        const input = "/!";
        const expected = "!\\!!";

        const actual = escapeExclaimsAndSlashes(input);
        expect(actual).toEqual(expected);

    });

    it("handles test 3", () => {
        const input = "///";
        const expected = "!\\!\\!\\";

        const actual = escapeExclaimsAndSlashes(input);
        expect(actual).toEqual(expected);

    });


});
