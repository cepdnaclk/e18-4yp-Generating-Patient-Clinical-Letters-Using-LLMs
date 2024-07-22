"use client";

// inbuild
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// mui
import { Button, Modal, Box, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import MicIcon from "@mui/icons-material/Mic";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import PrintIcon from "@mui/icons-material/Print";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CleaningServicesRoundedIcon from "@mui/icons-material/CleaningServicesRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Divider from "@mui/material/Divider";

// custom components
import MyDatePicker from "@/components/DatePicker";
import LetterTypeSelect from "@/components/LetterTypeSelect";
import PatientSearchBar from "@/components/PatientSearchBar";
import PatientSearchResults from "@/components/PatientSearchResults";
import DropDownMenu from "@/components/DropDownMenu";
import SettingDropDown from "@/components/SettingDropDown";

// other
import ReactQuill from "react-quill";
import jsPDF from "jspdf";
import { htmlToText } from "html-to-text";

// images
import profilePic from "@/public/images/profile_pic.jpg";

// css
import "react-datepicker/dist/react-datepicker.css";
import "./loadIcon.css";
import "./inputForm.css";
import "react-quill/dist/quill.bubble.css";

interface PatientDetails {
  patient_id: number;
  patient_name: string;
  birthdate: string;
}

interface HistoryDetail {
  date: string;
  details: string;
}

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike", "link"],
    [
      { header: "2" },
      { header: "3" },
      { align: [] },
      { color: [] },
      { background: [] },
    ],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};

const DataInputForm: React.FC<any> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [input, setInput] = useState("");
  const [period, setPeriod] = useState("");
  const [patientID, setPatientID] = useState("");
  const router = useRouter();

  const [micState, setMicState] = useState(false);
  // const [genLetIsClicked, setGenLetIsClicked] = useState(false);
  const [voice2TextInput, setVoice2TextInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipMsg, setTooltipMsg] = useState("");
  const [outputEditable, setOutputEditable] = useState(false);

  const [searchBarInput, setSearchBarInput] = useState("");
  const [letterType, setLetterType] = useState("Discharge");
  const [patientsSearched, setPatientsSearched] = useState({});
  const [searchResultListOpened, setSearchResultListOpened] = useState(false);

  const [selectedPatientDetails, setSelectedPatientDetails] =
    useState<PatientDetails>({
      patient_id: -1,
      patient_name: "",
      birthdate: "",
    });

  const [selectedDate0, setSelectedDate0] = useState<Date>(new Date());
  const [selectedDate1, setSelectedDate1] = useState<Date>(new Date());
  const [selectedDate2, setSelectedDate2] = useState<Date>(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [historyDetails, setHistoryDetails] = useState<HistoryDetail[]>([]);
  const [patientname, setPatientname] = useState("");

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSettingDropdownVisible, setIsSettingDropdownVisible] =
    useState(false);

  const outputRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<ReactQuill>(null);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const showDropdown = () => {
    setIsDropdownVisible(true);
  };

  const hideDropdown = () => {
    setTimeout(() => setIsDropdownVisible(false), 200); // Slight delay to allow cursor to move
  };

  const toggleSettingDropdown = () => {
    setIsSettingDropdownVisible(!isSettingDropdownVisible);
  };

  const showSettingDropdown = () => {
    setIsSettingDropdownVisible(true);
  };

  const hideSettingDropdown = () => {
    setTimeout(() => setIsSettingDropdownVisible(false), 200); // Slight delay to allow cursor to move
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTo({
        top: outputRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    if (quillRef.current) {
      // Access the editor's container element
      const editor = quillRef.current.getEditor();
      const scrollContainer = editor.root; // This is the actual content area of the editor

      // Scroll the content to the bottom
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [output]);

  const calculateAge = (birthdate: string) => {
    const birthDate = new Date(birthdate);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const saveHistoryData = async (
    patient_id: number,
    historyDate: Date,
    voice2TextInput: string
  ) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/savePatientHistory",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_id: patient_id,
            date: historyDate,
            historyDetails: voice2TextInput,
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        console.log("Error occured");
      }
    } catch (error: any) {
      console.log("Login failed", error.message);
    }
  };

  const handleGenLetterClick = async (voice2TextInput: string) => {
    try {
      const { patient_id, patient_name, birthdate } = selectedPatientDetails;

      // Validate patient_name and birthdate
      if (!patient_name || !birthdate) {
        alert("Please select a patient first!");
        throw new Error("Patient details incomplete or missing");
      }

      const prompt = `Name: ${patient_name}\nAge: ${calculateAge(
        birthdate
      )}\n${voice2TextInput}\n\ngenerate a ${letterType} letter for the above given patient details. Make sure to make the letter customized, descriptive and readable`;

      setLoading(true);
      setOutput(""); // Clear previous output
      saveHistoryData(patient_id, selectedDate0, voice2TextInput);
      const response = await fetch("http://localhost:5050/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-ft", // set ollama model
          prompt: prompt,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to send message");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";
      let firstWordShown = false;
      let uptoLastLine = "";
      let lastLine = "";

      const formatResponse = (text: string): string => {
        return text
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
          .replace(/\*(.*?)\*/g, "<em>$1</em>") // italic
          .replace(/\n/g, "<br />"); // newline
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });

        const lines = result.split("\n");
        result = lines.pop() || "";

        for (const line of lines) {
          if (line) {
            const parsed = JSON.parse(line);
            if (parsed.done) break;
            if (!firstWordShown) {
              setLoading(false);
              firstWordShown = true;
            }

            lastLine += parsed.response;
            setOutput(uptoLastLine + lastLine);
            if (parsed.response.includes("\n")) {
              uptoLastLine += formatResponse(lastLine);
              setOutput(uptoLastLine);
              lastLine = "";
            }
          }
        }
      }

      if (!firstWordShown) {
        setLoading(false);
      }

      // Append any remaining text in result to the output and format it
      const formattedResult = formatResponse(result);
      setOutput((prev) => prev + formattedResult);

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      setOutput("Error occurred! Try again");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "Enter") {
        if (voice2TextInput) {
          handleGenLetterClick(voice2TextInput);
        } else {
          alert("please enter patient deatails first!");
        }
      }
      if (event.ctrlKey && event.key === " ") {
        setMicState((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [voice2TextInput, handleGenLetterClick]);

  const cleanStringArray = (arr: string[]): string[] => {
    // Remove consecutive empty strings if both sides have non-empty strings
    const cleanedArray: string[] = [];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === "") {
        if (
          i === 0 ||
          i === arr.length - 1 ||
          arr[i - 1] === "" ||
          arr[i + 1] === ""
        ) {
          cleanedArray.push(arr[i]);
        } else {
          // If there's an empty string surrounded by non-empty strings, skip it
          continue;
        }
      } else {
        cleanedArray.push(arr[i]);
      }
    }

    // Remove multiple consecutive empty strings, keeping only one
    const resultArray: string[] = [];
    let wasLastEmpty = false;

    for (const item of cleanedArray) {
      if (item === "") {
        if (!wasLastEmpty) {
          resultArray.push(item);
          wasLastEmpty = true;
        }
      } else {
        resultArray.push(item);
        wasLastEmpty = false;
      }
    }

    return resultArray;
  };

  const downloadClinicalLetter = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const margin = 10;
    const pdfWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const pdfHeight = doc.internal.pageSize.getHeight() - margin * 2;
    const lineHeight = 5.5; // Adjust line height for better spacing within paragraphs
    const paragraphSpacing = 4.5; // Additional spacing between paragraphs
    const fontSize = 12; // Adjust the font size as needed
    doc.setFontSize(fontSize);

    // Convert HTML to text
    const text = htmlToText(output, {
      wordwrap: pdfWidth,
      ignoreImage: true, // Ignore images if not needed
    });

    // Split text into lines
    let lines: string[];
    if (outputEditable) {
      lines = cleanStringArray(doc.splitTextToSize(text, pdfWidth));
    } else {
      lines = doc.splitTextToSize(text, pdfWidth);
    }

    let cursorY = margin;
    let previousLineEmpty = false;

    // Add text to PDF
    lines.forEach((line: string) => {
      if (cursorY + lineHeight > pdfHeight) {
        doc.addPage();
        cursorY = margin;
      }

      if (!previousLineEmpty && line.trim() === "") {
        // Add extra space between paragraphs
        cursorY += paragraphSpacing;
      } else {
        if (line.trim() === "") {
        } else {
          doc.text(line, margin, cursorY);
          cursorY += lineHeight;
        }
      }

      previousLineEmpty = line.trim() === "";
    });

    doc.save("generated.pdf");
  };

  const handleCopyToClipboard = () => {
    const stripHtmlTags = (html: string): string => {
      const div = document.createElement("div");
      div.innerHTML = html.replace(/<br\s*\/?>/gi, "\n");
      return div.textContent || div.innerText || "";
    };

    const plainTextOutput = stripHtmlTags(output);

    navigator.clipboard
      .writeText(plainTextOutput)
      .then(() => {
        setTooltipMsg("Copied!");
        setTooltipOpen(true);
        setTimeout(() => setTooltipOpen(false), 2000);
      })
      .catch((err) => {
        setTooltipMsg("Error Copying!");
        setTooltipOpen(true);
        setTimeout(() => setTooltipOpen(false), 2000);
        console.error("Failed to copy: ", err);
      });
  };

  const handleDate1Change = (date: Date | null) => {
    if (date) {
      setSelectedDate1(date);
    }
  };

  const handleDate2Change = (date: Date | null) => {
    if (date) {
      setSelectedDate2(date);
    }
  };

  const handleDefaultChange = (date: Date | null) => {
    if (date) {
      setSelectedDate0(date);
    }
  };

  useEffect(() => {
    console.log("History details:", historyDetails);
  }, [historyDetails]);

  const viewHistory = async () => {
    setModalIsOpen(true);
    console.log("try");
    const { patient_id, patient_name, birthdate } = selectedPatientDetails;
    console.log(patient_id, patient_name);

    try {
      const response = await fetch("http://localhost:8080/api/patientHistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: patient_name,
          patient_id: patient_id,
          start_date: selectedDate1,
          end_date: selectedDate2,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json();

      const processedData = responseData.map(
        (item: { details: string; date: string }) => {
          const detailsArray = item.details.split("\n");

          const date = item.date;
          const details = detailsArray
            .filter((line) => !line.startsWith("Date:"))
            .join("\n");

          return { date, details };
        }
      );

      setHistoryDetails(processedData);

      console.log("processedData:", processedData);
    } catch (error: any) {
      console.log("Login failed", error.message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getUTCFullYear();
    return `${day} ${month} ${year}`;
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="data-input-container box-border w-full h-screen flex flex-col px-7 md:px-16 py-2">
      <div className="menu-bar w-full px-1 h-16 text-white flex flex-row place-content-between pt-2 mb-3">
        {/* <div>
          <MyDatePicker
            labelName="Date:"
            type="default"
            selectedDate={selectedDate0}
            onDateChange={handleDefaultChange}
          />
        </div> */}
        <div className="flex items-center bg-slate-600 hover:bg-slate-500 px-7 my-1 rounded-2xl text-white text-md font-medium">
          <label>Date:</label>
          <label className="ml-3 text-bold">
            {selectedDate0.toLocaleDateString()}
          </label>
        </div>

        <div className="right-menu-items h-fit w-fit flex flex-row">
          <div
            className="relative flex items-center bg-slate-500 hover:bg-slate-400 px-2 py-1 rounded-2xl mr-4"
            onMouseEnter={showSettingDropdown}
            onMouseLeave={hideSettingDropdown}
            onClick={toggleSettingDropdown}
          >
            <SettingsRoundedIcon />
            <SettingDropDown
              isDropdownVisible={isSettingDropdownVisible}
              hideDropdown={hideSettingDropdown}
            />
          </div>
          <div
            className="relative flex items-center bg-slate-500 hover:bg-slate-400 rounded-2xl"
            onMouseEnter={showDropdown}
            onMouseLeave={hideDropdown}
            onClick={toggleDropdown}
          >
            <div className="user-avatar bg-slate-200 w-9 h-9 rounded-full m-1 overflow-hidden flex-shrink-0 relative">
              <Image
                src={profilePic}
                alt="PP"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="user-name px-2 py-1 ml-2">
              <label className="text-white text-md font-medium min-w-32">
                Madhushan Nanayakkara
              </label>
            </div>
            <KeyboardArrowDownRoundedIcon className="mr-3" />
            <DropDownMenu
              isDropdownVisible={isDropdownVisible}
              hideDropdown={hideDropdown}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row h-full pb-7">
        <div className="box w-full md:w-1/2 h-full md:mr-4 flex flex-col">
          <div className="data-input-form mb-3 flex flex-col flex-grow h-4/5">
            <div className="font-sans text-lg font-medium tracking-wide ml-3 h-12">
              Patient Details
            </div>
            <div className="patient-identity flex w-full mb-7">
              <label
                htmlFor="patientName"
                className="flex items-center rounded-l-md font-sans text-slate-300 text-sm px-4 my-auto bg-slate-800 h-full"
              >
                Patient Name/No
              </label>
              <div className="search-bar-container relative flex flex-grow flex-col">
                <PatientSearchBar
                  searchBarInput={searchBarInput}
                  setSearchBarInput={setSearchBarInput}
                  setPatientsSearched={setPatientsSearched}
                  setSearchResultListOpened={setSearchResultListOpened}
                />
                {searchResultListOpened ? (
                  <>
                    <PatientSearchResults
                      patientsSearched={patientsSearched}
                      setPatientsSearched={setPatientsSearched}
                      setSearchResultListOpened={setSearchResultListOpened}
                      setSearchBarInput={setSearchBarInput}
                      setSelectedPatientDetails={setSelectedPatientDetails}
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
              <LetterTypeSelect
                letterType={letterType}
                setLetterType={setLetterType}
              />
            </div>
            <div className="voice2text-container relative flex-grow mb-4">
              <div className="relative h-full overflow-hidden font-sans font-medium text-sm text-slate-300 bg-slate-700 rounded-md">
                <textarea
                  className="absolute inset-0 w-full h-full bg-transparent px-4 py-7 text-justify resize-none"
                  style={{ whiteSpace: "pre-line" }}
                  value={voice2TextInput}
                  placeholder="Describe patient disease, symptoms, diagnosis and treatment..."
                  onChange={(e) => setVoice2TextInput(e.target.value)}
                />
              </div>
              <div className="voice2text-controllers absolute flex flex-row">
                <div
                  className={`${
                    micState
                      ? "w-32 px-3 bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 active:bg-red-700 active:border-red-800"
                      : "w-12 bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700 active:bg-green-800 active:border-green-900"
                  } h-9 rounded-2xl flex justify-center items-center shadow-lg border text-white font-sans font-medium hover:text-white 
                  active:text-white mr-1 transition-all duration-300 ease-in-out`}
                  onClick={() => {
                    setMicState((prevState) => !prevState);
                  }}
                >
                  {micState ? (
                    <>
                      <StopRoundedIcon style={{ fontSize: 20 }} />
                      <label className="text-sm ml-2 transition-opacity duration-300 ease-in-out opacity-100">
                        00:00:01
                      </label>
                    </>
                  ) : (
                    <MicIcon style={{ fontSize: 20 }} />
                  )}
                </div>
              </div>
              <div
                className="gen-letter bg-sky-500 w-fit h-8 px-5 rounded-2xl absolute flex justify-center 
                items-center shadow-lg border border-sky-500 text-white font-sans font-medium hover:bg-sky-600 
                hover:text-white hover:border-sky-600 active:bg-sky-700 active:text-white active:border-sky-800"
                onClick={() => handleGenLetterClick(voice2TextInput)}
              >
                <AutoFixHighRoundedIcon className="mr-1 text-lg" />
                <label>Generate Patient Clinical Letter</label>
              </div>
            </div>
          </div>

          <div className="data-input-form flex flex-grow flex-grow-0 flex-col h-1/5">
            <div className="font-sans text-lg font-medium tracking-wide ml-3 h-11">
              Patient History
            </div>
            <div className="period-select flex-glow bg-slate-700 w-full h-full flex items-center justify-center rounded-md py-3">
              <label className="font-sans text-slate-200 font-medium tracking-wide pr-10">
                Period
              </label>

              <label className="font-sans text-slate-200 text-sm font-medium tracking-wide pr-1">
                from
              </label>
              <MyDatePicker
                labelName=""
                type="history"
                selectedDate={selectedDate1}
                onDateChange={handleDate1Change}
              />
              <label className="font-sans text-slate-200 text-sm font-medium tracking-wide px-1">
                to
              </label>
              <MyDatePicker
                labelName=""
                type="history"
                selectedDate={selectedDate2}
                onDateChange={handleDate2Change}
              />

              <Button
                style={{
                  marginLeft: "15px",
                  backgroundColor: "#0EA5E9",
                  padding: "1px 10px",
                  textTransform: "capitalize",
                }}
                variant="contained"
                onClick={viewHistory}
              >
                View History
              </Button>
            </div>
          </div>
        </div>
        <div className="box w-full md:w-1/2 h-full flex flex-col">
          <div className="box data-input-form flex flex-col w-full h-full">
            <div className="font-sans text-lg font-medium tracking-wide ml-3 h-12">
              Output
            </div>
            <div className="output-container relative flex-grow">
              <div className="relative h-full font-sans font-medium text-sm text-slate-300 bg-slate-800 rounded-md">
                {loading ? (
                  <>
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="lds-facebook">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </>
                ) : outputEditable ? (
                  <>
                    <ReactQuill
                      className="output-textarea absolute inset-0 w-full h-full bg-transparent pt-4 pb-2 text-justify resize-none"
                      theme="bubble"
                      value={output}
                      onChange={setOutput}
                      modules={modules} // Use custom toolbar
                      ref={quillRef}
                    />
                  </>
                ) : (
                  <>
                    <div
                      className="output-textarea absolute inset-0 w-full h-full bg-transparent px-4 py-7 text-justify resize-none overflow-auto cursor-default"
                      dangerouslySetInnerHTML={{ __html: output }}
                      ref={outputRef}
                    ></div>
                  </>
                )}
              </div>
              <div className="output-controllers absolute flex flex-row">
                <div
                  className={`${
                    outputEditable ? "w-32 px-3" : "w-10"
                  } bg-red-500 h-9 rounded-2xl flex justify-center items-center shadow-lg border 
                  border-red-500 text-white font-sans font-medium hover:bg-red-600 hover:text-white hover:border-red-600 
                  active:bg-red-700 active:text-white active:border-red-800 mr-1 transition-all duration-300 ease-in-out overflow-hidden`}
                  onClick={() => {
                    setOutputEditable((prevState) => !prevState);
                  }}
                >
                  <DriveFileRenameOutlineRoundedIcon style={{ fontSize: 20 }} />
                  {outputEditable ? (
                    <label
                      className="text-sm w-15 ml-2 opacity-100 transform translate-x-0"
                      style={{
                        transition:
                          "transform 300ms ease-in-out 50ms, opacity 300ms ease-in-out",
                      }}
                    >
                      Edit Mode
                    </label>
                  ) : (
                    <label
                      className="text-sm w-15 opacity-0 transform translate-x-full"
                      style={{
                        transition:
                          "transform 50ms ease-in-out, opacity 300ms ease-in-out",
                      }}
                    ></label>
                  )}
                </div>

                <Tooltip title={tooltipMsg} open={tooltipOpen} arrow>
                  <div
                    className="bg-green-500 w-10 h-9 rounded-2xl flex justify-center items-center shadow-lg border 
                    border-green-500 text-white font-sans font-medium hover:bg-green-600 hover:text-white hover:border-green-600 
                    active:bg-green-700 active:text-white active:border-green-800 mr-1"
                    onClick={handleCopyToClipboard}
                  >
                    <ContentCopyRoundedIcon style={{ fontSize: 19 }} />
                  </div>
                </Tooltip>

                <div
                  className="bg-blue-500 w-10 h-9 rounded-2xl flex justify-center items-center shadow-lg border 
                  border-blue-500 text-white font-sans font-medium hover:bg-blue-600 hover:text-white hover:border-blue-600 
                  active:bg-blue-700 active:text-white active:border-blue-800 mr-1"
                  onClick={() => {
                    setOutput("");
                  }}
                >
                  <CleaningServicesRoundedIcon style={{ fontSize: 19 }} />
                </div>

                <div
                  className="bg-purple-500 w-10 h-9 rounded-2xl flex justify-center items-center shadow-lg border 
                  border-purple-500 text-white font-sans font-medium hover:bg-purple-600 hover:text-white hover:border-purple-600 
                  active:bg-purple-700 active:text-white active:border-purple-800"
                  onClick={() => downloadClinicalLetter()}
                >
                  <PrintIcon style={{ fontSize: 19 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex items-center justify-center"
      >
        <Box
          className="fixed  flex items-top justify-center rounded-lg border-2 border-black overflow-y-auto font-sans font-medium text-sm text-slate-300 bg-slate-800 modal-content"
          sx={{
            width: "50%",
            height: "75%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
          }}
        >
          <div className="w-full">
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="mb-4"
            >
              Patient History
            </Typography>
            <Typography id="modal-modal-description" className="mt-4">
              {historyDetails.map((historyDetail, index) => (
                <React.Fragment key={index}>
                  {historyDetail.date ? (
                    <>
                      <strong>{formatDate(historyDetail.date)}</strong>
                      <br />
                    </>
                  ) : (
                    <>
                      "Hi"
                      <br />
                    </> // Fallback text if date is not present
                  )}
                  {historyDetail.details ? (
                    historyDetail.details
                      .split("\r\n")
                      .map((line, lineIndex) => (
                        <span key={lineIndex}>
                          {line}
                          <br />
                        </span>
                      ))
                  ) : (
                    <>Hi</>
                  )}
                  {index < historyDetails.length - 1 && <br />}{" "}
                  <>
                    <Divider style={{ borderColor: "#A5A5A4" }} /> <br />
                    {/* Add a divider between details */}
                  </>
                  {/* Add a break between details */}
                </React.Fragment>
              ))}
            </Typography>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default DataInputForm;
