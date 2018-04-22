import React from "react";
import App from "./app.jsx";
import ReactDOM from "react-dom";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("App", () => {
	it("renders without crashing", () => {
		const div = document.createElement("div");

		ReactDOM.render(<App />, div);
	});

	it("should toggle state.useSampleData to false and set state.data to empty nested array", () => {
		const wrapper = shallow(<App />);

		expect(wrapper.state("useSampleData")).toEqual(true);
		wrapper
			.find('input[type="radio"][id="custom"]')
			.simulate("change", { target: { value: "false" } });
		expect(wrapper.state("useSampleData")).toEqual(false);
		expect(wrapper.state("data")).toEqual([[]]);
	});

	it("should parse CSV file and add it to state.data", () => {
		const wrapper = shallow(<App />);

		wrapper.find('input[type="file"]').simulate("change", {
			target: {
				files: ["A,B,C\nD,E,F"]
			}
		});
		expect(wrapper.state("data")).toEqual([["A", "B", "C"], ["D", "E", "F"]]);
		expect(wrapper.state("headerRow")).toEqual(["A", "B", "C"]);
	});

	it("should edit a randomly-selected header without changing state.data unless edits are saved", () => {
		const wrapper = shallow(<App />);

		wrapper.find('input[type="file"]').simulate("change", {
			target: {
				files: ["A,B,C\nD,E,F"]
			}
		});
		const originalData = wrapper.state("data");

		let headerRow = wrapper.state("data")[0];

		const headerRowLength = headerRow.length;

		const randomIndex = Math.floor(Math.random() * headerRowLength);

		const randomHeader = headerRow[randomIndex];

		wrapper
			.find('button[value="editHeaders"]')
			.simulate("click", { target: { value: "editHeaders" } });
		expect(wrapper.state("showEditHeaderForm")).toEqual(true);
		wrapper
			.find("input[id=" + randomIndex + "][value='" + randomHeader + "']")
			.simulate("change", {
				target: { id: randomIndex, value: "editedValue" }
			});
		headerRow[randomIndex] = "editedValue";
		expect(wrapper.state("headerRow")).toEqual(headerRow);
		expect(wrapper.state("data")).toEqual(originalData);
	});

	it("should save edits and update state.data with edited header row", () => {
		const wrapper = shallow(<App />);

		wrapper.find('input[type="file"]').simulate("change", {
			target: {
				files: ["A,B,C\nD,E,F"]
			}
		});
		let data = wrapper.state("data");

		let headerRow = wrapper.state("data")[0];

		const headerRowLength = headerRow.length;

		const randomIndex = Math.floor(Math.random() * headerRowLength);

		const randomHeader = headerRow[randomIndex];

		wrapper
			.find('button[value="editHeaders"]')
			.simulate("click", { target: { value: "editHeaders" } });
		expect(wrapper.state("showEditHeaderForm")).toEqual(true);
		wrapper
			.find("input[id=" + randomIndex + "][value='" + randomHeader + "']")
			.simulate("change", {
				target: { id: randomIndex, value: "editedValue" }
			});
		wrapper.find("button[value='saveEditedHeaders']").simulate("click");
		headerRow[randomIndex] = "editedValue";
		data[0] = headerRow;
		expect(wrapper.state("data")).toEqual(data);
	});

	it("should add new header row", () => {
		const wrapper = shallow(<App />);

		wrapper.find('input[type="file"]').simulate("change", {
			target: {
				files: ["A,B,C\nD,E,F"]
			}
		});

		const dataLength = wrapper.state("data").length;
		wrapper
			.find('button[value="addHeaders"]')
			.simulate("click", { target: { value: "addHeaders" } });
		expect(wrapper.state("showAddHeaderForm")).toEqual(true);
		wrapper.state("headerRow").forEach((header, index) => {
			wrapper
				.find("input[id=" + index + "][value=null]")
				.simulate("change", { target: { id: index, value: "editedValue" } });
		});
		wrapper.find("button[value='saveAddedHeaders']").simulate("click");
		expect(wrapper.state("data").length).toBe(dataLength + 1);
	});

	it("should reset header row if add headers is canceled", () => {
		const wrapper = shallow(<App />);

		wrapper.find('input[type="file"]').simulate("change", {
			target: {
				files: ["A,B,C\nD,E,F"]
			}
		});
		let data = wrapper.state("data");

		const dataLength = data.length;

		let headerRow = wrapper.state("data")[0];
		wrapper
			.find('button[value="addHeaders"]')
			.simulate("click", { target: { value: "addHeaders" } });
		wrapper.find("button[value='cancelAddDialog']").simulate("click");
		expect(wrapper.state("headerRow")).toEqual(headerRow);
		expect(wrapper.state("data")).toEqual(data);
		expect(wrapper.state("data").length).toBe(dataLength);
	});

	it("should reset header row if edit headers is canceled", () => {
		const wrapper = shallow(<App />);

		wrapper.find('input[type="file"]').simulate("change", {
			target: {
				files: ["A,B,C\nD,E,F"]
			}
		});
		let data = wrapper.state("data");

		const dataLength = data.length;

		let headerRow = wrapper.state("data")[0];

		const headerRowLength = headerRow.length;

		wrapper
			.find('button[value="editHeaders"]')
			.simulate("click", { target: { value: "editHeaders" } });
		wrapper.find("button[value='cancelEditDialog']").simulate("click");
		expect(wrapper.state("headerRow")).toEqual(headerRow);
		expect(wrapper.state("data")).toEqual(data);
		expect(wrapper.state("data").length).toBe(dataLength);
	});

	it("should reset state.data if user reselects sampleData option after file upload", () => {
		const wrapper = shallow(<App />);

		const originalData = wrapper.state("data");

		wrapper
			.find('input[type="radio"][id="custom"]')
			.simulate("change", { target: { value: "false" } });
		wrapper.find('input[type="file"]').simulate("change", {
			target: {
				files: ["A,B,C\nD,E,F"]
			}
		});
		expect(wrapper.state("data")).toEqual([["A", "B", "C"], ["D", "E", "F"]]);
		wrapper
			.find('input[type="radio"][id="default"]')
			.simulate("change", { target: { value: "true" } });
		expect(wrapper.state("data")).toEqual(originalData);
	});
});
