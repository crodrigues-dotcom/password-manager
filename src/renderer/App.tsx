/* eslint-disable no-buffer-constructor */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom";
import LeftBar from "components/LeftBar";
import Item from "model/Item";
import { useEffect, useState } from "react";
import "./App.css";
import AllCategoriesPanel from "components/AllCategoriesPanel";

import { useNavigate } from "react-router-dom";
import fs from "fs";
import path from "path";
import { encryptData, decryptData } from "lib/crypto_utils";
import SearchPanel from "components/SearchPanel";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

let password = "";
const savePath = path.dirname(path.dirname(__dirname));
const dataPath = path.join(savePath, "items.json");
const saltPath = path.join(savePath, "salt");
const ivPath = path.join(savePath, "iv");

function readEncryptionElementsFromFiles() {
    const data = fs.readFileSync(dataPath, "binary");
    const salt = new Buffer(fs.readFileSync(saltPath, "binary"), "binary");
    const iv = new Buffer(fs.readFileSync(ivPath, "binary"), "binary");

    return { data, salt, iv };
}

function EnterPassword() {
    const [isNewUser, setIsNewUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(dataPath);
        setIsNewUser(!fs.existsSync(dataPath));
    }, []);

    return (
        <div className="enterPassword">
            {isNewUser ? (
                <div className="ep">
                    <h1>Register</h1>
                    <form>
                        <input type="password" name="password" id="password" />
                        <input
                            type="submit"
                            value="Register"
                            onClick={() => {
                                const passwordInput = document.getElementById("password") as HTMLInputElement
                                const enPassword = passwordInput.value;

                                const data = JSON.stringify([], null, 2);
                                const { encryptedData, salt, iv } = encryptData(data, enPassword);
                                fs.writeFileSync(dataPath, encryptedData);
                                fs.writeFileSync(saltPath, salt, null);
                                fs.writeFileSync(ivPath, iv, null);
                                password = enPassword;
                                navigate("/main");
                            }}
                        />
                    </form>
                </div>
            ) : (
                <div className="ep">
                    <ToastContainer />
                    <h1>Login</h1>
                    <form>
                        <input type="password" name="password" id="password" />
                        <input
                            type="submit"
                            value="Login"
                            onClick={() => {
                                const passwordInput = document.getElementById("password") as HTMLInputElement
                                const enPassword = passwordInput.value;

                                const { data, salt, iv } = readEncryptionElementsFromFiles();
                                try {
                                    const decryptedData = decryptData(data, enPassword, salt, iv);
                                    password = enPassword;
                                    navigate("/main");
                                } catch (error) {
                                    toast.error("Wrong password!", {
                                        position: "top-center",
                                        autoClose: 3000,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "dark",
                                    });
                                }
                            }}
                        />
                    </form>
                </div>
            )}
        </div>
    );
}

function Main() {
    const [selectedCategory, setSelectedCategory] = useState("All categories");
    const [items, setItems] = useState<[Item]>([]);
    const [canWrite, setCanWrite] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Function to load items from the JSON file
        const loadItemsFromFile = () => {
            const filePath = path.join(savePath, "items.json");
            if (!fs.existsSync(filePath)) {
                return;
            }

            const { data, salt, iv } = readEncryptionElementsFromFiles();
            const decryptedData = decryptData(data, password, salt, iv);
            const parsedData = JSON.parse(decryptedData);
            setItems(parsedData);
            setCanWrite(true);
            if (parsedData.length > 0) {
                setSelectedItemIndex(0);
            }
        };

        // Call the function to load items from file when the app starts
        loadItemsFromFile();
    }, []);

    useEffect(() => {
        // Function to write the items to a JSON file
        const writeItemsToFile = () => {
            const filePath = path.join(savePath, "items.json");
            const data = JSON.stringify(items, null, 2);
            const { encryptedData, salt, iv } = encryptData(data, password);

            fs.writeFileSync(filePath, encryptedData);
            fs.writeFileSync(path.join(savePath, "salt"), salt, null);
            fs.writeFileSync(path.join(savePath, "iv"), iv, null);
        };

        // Call the function to write items to file after items state is updated
        if (canWrite) {
            writeItemsToFile();
        }
    }, [canWrite, items]);

    return (
        <div className="main">
            <ToastContainer />
            <LeftBar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <div className="mainRight">
                <SearchPanel
                    search={search}
                    setSearch={setSearch}
                    setItems={setItems}
                    setSelectedItemIndex={setSelectedItemIndex}
                />
                <AllCategoriesPanel
                    showFavouritesOnly={selectedCategory === "Favourites"}
                    search={search}
                    items={items}
                    setItems={setItems}
                    selectedItemIndex={selectedItemIndex}
                    setSelectedItemIndex={setSelectedItemIndex}
                />
            </div>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<EnterPassword />} />
                <Route path="/main" element={<Main />} />
            </Routes>
        </Router>
    );
}
