// src/components/FileUpload/FileUpload.tsx

import React, { useState, useEffect, ChangeEvent } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Form,
  Alert,
  Badge,
} from "react-bootstrap";
import axios from "../../axios"; // Ensure axios is correctly configured
import "./FileUpload.css"; // Import the CSS file
import { FaTrash, FaDownload, FaPlus, FaUpload } from "react-icons/fa";
import ThreeDViewer from "../ThreeDViewer/ThreeDViewer"; // Import the ThreeDViewer component
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary"; // Import the ErrorBoundary component

// Define the structure of each uploaded file
interface UploadedFile {
  name: string;
  size: string;
  type: string;
  status: "Ready" | "Sliced ✔" | "Error";
  file: File;
  weight_grams: number | null;
  cost_LKR: number | null;
  download_url: string | null;
  original_file_url: string | null;
}

// Define the structure of the upload settings
interface UploadSettings {
  material: string;
  support: string;
  supportEnabled: boolean;
  layerHeight: number;
  quality: string;
  pattern: string;
  color: string;
}

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>(() => {
    const savedFiles = localStorage.getItem("uploadedFiles");
    return savedFiles ? JSON.parse(savedFiles) : [];
  });

  const [showDropzone, setShowDropzone] = useState<boolean>(true);
  const [settings, setSettings] = useState<UploadSettings>(() => {
    const savedSettings = localStorage.getItem("uploadSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          material: "PLA",
          support: "None",
          supportEnabled: false,
          layerHeight: 0.2,
          quality: "Standard Quality - 0.2 mm",
          pattern: "Cubic",
          color: "Red",
        };
  });

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    variant: "success" | "danger" | "warning" | "info";
    message: string;
  }>({ show: false, variant: "info", message: "" });

  const acceptedFileTypes: { [key: string]: string[] } = {
    "application/sla": [".stl", ".obj", ".3mf", ".fbx"],
    "application/vnd.ms-pki.stl": [".stl"],
    "application/x-stl": [".stl"],
    "model/stl": [".stl"],
    "model/3mf": [".3mf"],
    "application/octet-stream": [".stl", ".obj", ".3mf", ".fbx"],
  };
  const maxFileSize = 50 * 1024 * 1024; // 50 MB limit

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const filteredFiles = acceptedFiles.filter((file) => {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const mimeType = file.type;

      const isValidExtension = [".stl", ".obj", ".3mf", ".fbx"].includes(fileExtension || "");
      const isValidMimeType = Object.keys(acceptedFileTypes).includes(mimeType);

      if (!isValidExtension || !isValidMimeType) {
        setAlert({
          show: true,
          variant: "danger",
          message: `Unsupported file type: ${fileExtension?.toUpperCase()}. Supported types: .stl, .obj, .3mf, .fbx`,
        });
        return false;
      }

      if (file.size > maxFileSize) {
        setAlert({
          show: true,
          variant: "danger",
          message: `File size exceeds the limit of ${maxFileSize / (1024 * 1024)} MB`,
        });
        return false;
      }

      return true;
    });

    if (filteredFiles.length > 0) {
      if (files.length + filteredFiles.length > 5) {
        setAlert({
          show: true,
          variant: "warning",
          message: "You can only upload up to 5 files.",
        });
        return;
      }

      const newFiles: UploadedFile[] = filteredFiles.map((file) => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        type: file.type,
        status: "Ready",
        file: file,
        weight_grams: null,
        cost_LKR: null,
        download_url: null,
        original_file_url: null,
      }));

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setUploadProgress(0);
      setIsUploading(false);
      setShowDropzone(false);
    } else {
      setShowDropzone(true);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: maxFileSize,
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      setAlert({
        show: true,
        variant: "info",
        message: "Please add files before uploading.",
      });
      return;
    }

    const formData = new FormData();

    // Append files to the form data
    files.forEach((item) => formData.append("file", item.file));

    // Prepare settings for backend
    const settingsJson = {
      quality: settings.quality,
      support: settings.supportEnabled,
      material: settings.material,
      pattern: settings.pattern,
      color: settings.color,
    };

    formData.append("settings_json", JSON.stringify(settingsJson));

    setIsUploading(true);
    setAlert({ show: false, variant: "info", message: "" });

    try {
      const response = await axios.post("/upload", formData, {
        onUploadProgress: (progressEvent: ProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      const uploadedFiles: any[] = response.data.uploaded_files;

      setFiles((prevFiles) =>
        prevFiles.map((item) => {
          const matchedFile = uploadedFiles.find(
            (file) => file.filename === item.name
          );
          if (matchedFile) {
            return {
              ...item,
              status: "Sliced ✔",
              weight_grams: matchedFile.weight_grams,
              cost_LKR: matchedFile.cost_LKR,
              download_url: matchedFile.download_url,
              original_file_url: matchedFile.original_file_url,
            };
          }
          return item;
        })
      );

      setAlert({
        show: true,
        variant: "success",
        message: "Files uploaded and sliced successfully!",
      });
    } catch (error: any) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setAlert({
        show: true,
        variant: "danger",
        message:
          "Upload or slicing failed. Please check your files and try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadGCode = (file: UploadedFile) => {
    if (file.download_url) {
      window.open(file.download_url, "_blank");
    } else {
      setAlert({
        show: true,
        variant: "warning",
        message: "Download link is not available.",
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (updatedFiles.length === 0) {
      setShowDropzone(true);
    }
  };

  const handleRemoveAll = () => {
    setFiles([]);
    setShowDropzone(true);
    setAlert({
      show: true,
      variant: "info",
      message: "All files have been removed.",
    });
  };

  const handleAddMore = () => {
    setShowDropzone(true);
  };

  const qualityProfiles: { name: string; value: number }[] = [
    { name: "Super Quality - 0.12 mm", value: 0.12 },
    { name: "Dynamic Quality - 0.16 mm", value: 0.16 },
    { name: "Standard Quality - 0.2 mm", value: 0.2 },
    { name: "Low Quality - 0.28 mm", value: 0.28 },
  ];

  const infillPatterns: string[] = [
    "Grid",
    "Lines",
    "Triangles",
    "Tri-Hexagon",
    "Cubic",
    "Cubic Subdivision",
    "Octet",
    "Quarter Cubic",
    "Concentric",
    "Zig Zag",
    "Cross",
    "Cross 3D",
    "Gyroid",
    "Lightning",
  ];

  const handleQualityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedQuality = qualityProfiles.find(
      (profile) => profile.name === event.target.value
    );
    if (selectedQuality) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        quality: selectedQuality.name,
        layerHeight: selectedQuality.value,
      }));
    }
  };

  useEffect(() => {
    localStorage.setItem("uploadSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(
      "uploadedFiles",
      JSON.stringify(
        files.map(
          ({
            name,
            size,
            type,
            status,
            weight_grams,
            cost_LKR,
            download_url,
            original_file_url,
          }) => ({
            name,
            size,
            type,
            status,
            weight_grams,
            cost_LKR,
            download_url,
            original_file_url,
          })
        )
      )
    );
  }, [files]);

  useEffect(() => {
    if (files.length > 0) {
      setShowDropzone(false);
    }
  }, [files]);

  return (
    <Container className="upload-container mt-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              {alert.show && (
                <Alert
                  variant={alert.variant}
                  onClose={() => setAlert({ ...alert, show: false })}
                  dismissible
                >
                  {alert.message}
                </Alert>
              )}

              {showDropzone && (
                <div
                  {...getRootProps()}
                  className={`dropzone p-5 text-center border border-secondary rounded ${
                    isDragActive ? "active-dropzone" : ""
                  }`}
                >
                  <input {...getInputProps()} />
                  <FaUpload size={50} color="#6c757d" />
                  <p className="mt-3 fw-bold">
                    {isDragActive
                      ? "Drop the files here..."
                      : "Drag and drop files here, or click to select files"}
                  </p>
                  <em>(Only .stl, .obj, .3mf, .fbx files are accepted)</em>
                </div>
              )}

              {files.length > 0 && (
                <div className="file-details mt-4">
                  {files.map((item, index) => (
                    <Card
                      key={index}
                      className="mb-3 shadow-sm"
                      bg={item.status === "Sliced ✔" ? "light" : ""}
                    >
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col md={4}>
                            <Card.Title className="mb-1">{item.name}</Card.Title>
                            <Card.Text className="text-muted">{item.size}</Card.Text>
                          </Col>
                          <Col md={2}>
                            <Badge
                              bg={
                                item.status === "Ready"
                                  ? "secondary"
                                  : item.status === "Sliced ✔"
                                  ? "success"
                                  : "danger"
                              }
                              pill
                            >
                              {item.status}
                            </Badge>
                          </Col>
                          <Col md={3}>
                            {isUploading && (
                              <ProgressBar
                                now={uploadProgress}
                                label={`${uploadProgress}%`}
                                striped
                                animated
                              />
                            )}
                          </Col>
                          <Col md={3}>
                            {item.status === "Sliced ✔" && (
                              <div className="mt-2">
                                <p className="mb-1">
                                  <strong>Weight:</strong> {item.weight_grams} g
                                </p>
                                <p className="mb-1">
                                  <strong>Cost:</strong> {item.cost_LKR} LKR
                                </p>
                              </div>
                            )}
                          </Col>
                          <Col md={12} className="mt-3">
                            <div className="d-flex justify-content-end">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveFile(index)}
                                className="me-2"
                              >
                                <FaTrash /> Remove
                              </Button>
                              {item.status === "Sliced ✔" && (
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleDownloadGCode(item)}
                                >
                                  <FaDownload /> Download
                                </Button>
                              )}
                            </div>
                            {item.status === "Sliced ✔" && item.original_file_url && (
                              <div className="mt-3">
                                <ErrorBoundary>
                                  <ThreeDViewer
                                    fileUrl={`http://localhost:5000${item.original_file_url}`}
                                  />
                                </ErrorBoundary>
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}

              {files.length > 0 && (
                <div className="buttons-container d-flex justify-content-between mt-4">
                  <Button
                    onClick={handleUpload}
                    className="me-2"
                    disabled={isUploading}
                    variant="primary"
                  >
                    <FaUpload className="me-1" />
                    {isUploading ? "Uploading..." : "Get Quote"}
                  </Button>
                  <div>
                    <Button
                      onClick={handleAddMore}
                      className="me-2"
                      variant="secondary"
                      disabled={files.length >= 5}
                    >
                      <FaPlus className="me-1" />
                      Add More
                    </Button>
                    <Button onClick={handleRemoveAll} variant="danger">
                      <FaTrash className="me-1" />
                      Remove All
                    </Button>
                  </div>
                </div>
              )}

              {files.length > 0 && (
                <div className="settings-section mt-4">
                  <Card className="shadow-sm">
                    <Card.Header as="h5">Print Settings</Card.Header>
                    <Card.Body>
                      <Form>
                        <Form.Group as={Row} className="mb-3" controlId="quality">
                          <Form.Label column sm={3}>
                            Print Quality:
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Select
                              value={settings.quality}
                              onChange={handleQualityChange}
                            >
                              {qualityProfiles.map((profile, index) => (
                                <option key={index} value={profile.name}>
                                  {profile.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="material">
                          <Form.Label column sm={3}>
                            Material:
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Select
                              value={settings.material}
                              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                setSettings({ ...settings, material: e.target.value })
                              }
                            >
                              <option value="PLA">PLA</option>
                              <option value="ABS">ABS</option>
                              <option value="PETG">PETG</option>
                            </Form.Select>
                          </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="pattern">
                          <Form.Label column sm={3}>
                            Infill Pattern:
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Select
                              value={settings.pattern}
                              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                setSettings((prevSettings) => ({
                                  ...prevSettings,
                                  pattern: e.target.value,
                                }))
                              }
                            >
                              {infillPatterns.map((pattern, index) => (
                                <option key={index} value={pattern}>
                                  {pattern}
                                </option>
                              ))}
                            </Form.Select>
                          </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="color">
                          <Form.Label column sm={3}>
                            Color:
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Select
                              value={settings.color}
                              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                setSettings({ ...settings, color: e.target.value })
                              }
                            >
                              <option value="Red">Red</option>
                              <option value="Black">Black</option>
                              <option value="White">White</option>
                            </Form.Select>
                          </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="support">
                          <Form.Label column sm={3}>
                            Enable Support:
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Check
                              type="switch"
                              id="support-switch"
                              checked={settings.supportEnabled}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setSettings((prevSettings) => ({
                                  ...prevSettings,
                                  supportEnabled: e.target.checked,
                                }))
                              }
                            />
                          </Col>
                        </Form.Group>

                        {settings.supportEnabled && (
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="supportType"
                          >
                            <Form.Label column sm={3}>
                              Support Type:
                            </Form.Label>
                            <Col sm={9}>
                              <Form.Select
                                value={settings.support}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                  setSettings((prevSettings) => ({
                                    ...prevSettings,
                                    support: e.target.value,
                                  }))
                                }
                              >
                                <option value="None">None</option>
                                <option value="Tree">Tree</option>
                                <option value="Normal">Normal</option>
                              </Form.Select>
                            </Col>
                          </Form.Group>
                        )}
                      </Form>
                    </Card.Body>
                  </Card>
                </div>
              )}

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FileUpload;
