import React, { useState, useEffect, ChangeEvent } from 'react';
import { FileText, Clock, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone, FileWithPath } from 'react-dropzone';
import axios from '../../axios';
import { AxiosProgressEvent } from 'axios';
import { FaTrash, FaDownload, FaUpload } from 'react-icons/fa';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'; 
import ThreeDViewer from '../ThreeDViewer/ThreeDViewer'; 
import { Card, CardContent } from './../Card/Card'; 
import Button from './../Button/Button'; 

// Define the structure of each uploaded file
interface UploadedFile {
  name: string;
  size: string;
  type: string;
  status: 'Ready' | 'Sliced ✔' | 'Error';
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

const CustomOrders: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    return savedFiles ? JSON.parse(savedFiles) : [];
  });

  const [settings, setSettings] = useState<UploadSettings>(() => {
    const savedSettings = localStorage.getItem('uploadSettings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          material: 'PLA',
          support: 'None',
          supportEnabled: false,
          layerHeight: 0.2,
          quality: 'Standard Quality - 0.2 mm',
          pattern: 'Cubic',
          color: 'Red',
        };
  });

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [quote, setQuote] = useState<number>(0);
  const [formData, setFormData] = useState({
    projectType: '',
    quantity: '1',
    notes: '',
  });

  const acceptedFileTypes: { [key: string]: string[] } = {
    'application/sla': ['.stl', '.obj', '.3mf', '.fbx'],
    'application/vnd.ms-pki.stl': ['.stl'],
    'application/x-stl': ['.stl'],
    'model/stl': ['.stl'],
    'model/3mf': ['.3mf'],
    'application/octet-stream': ['.stl', '.obj', '.3mf', '.fbx'],
  };
  const maxFileSize = 50 * 1024 * 1024; // 50 MB limit

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const filteredFiles = acceptedFiles.filter((file) => {
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const mimeType = file.type;

      const isValidExtension = ['.stl', '.obj', '.3mf', '.fbx'].includes(fileExtension || '');
      const isValidMimeType = Object.keys(acceptedFileTypes).includes(mimeType);

      if (!isValidExtension || !isValidMimeType) {
        toast.error(
          `Unsupported file type: ${fileExtension?.toUpperCase()}. Supported types: .stl, .obj, .3mf, .fbx`,
          { theme: 'colored', position: 'bottom-right' }
        );
        return false;
      }

      if (file.size > maxFileSize) {
        toast.error(`File size exceeds the limit of ${maxFileSize / (1024 * 1024)} MB`, {
          theme: 'colored',
          position: 'bottom-right',
        });
        return false;
      }

      return true;
    });

    if (filteredFiles.length > 0) {
      if (files.length + filteredFiles.length > 5) {
        toast.warning('You can only upload up to 5 files.', {
          theme: 'colored',
          position: 'bottom-right',
        });
        return;
      }

      const newFiles: UploadedFile[] = filteredFiles.map((file) => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type,
        status: 'Ready',
        file: file,
        weight_grams: null,
        cost_LKR: null,
        download_url: null,
        original_file_url: null,
      }));

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.keys(acceptedFileTypes).reduce((acc, key) => {
      acc[key] = acceptedFileTypes[key];
      return acc;
    }, {} as { [key: string]: string[] }),
    maxSize: maxFileSize,
  });

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

  const handleSettingsChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGetQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please upload at least one 3D model file.', {
        theme: 'colored',
        position: 'bottom-right',
      });
      return;
    }

    const formDataToSubmit = new FormData();

    // Append files to the form data
    files.forEach((item) => formDataToSubmit.append('file', item.file));

    // Prepare settings for backend
    const settingsJson = {
      quality: settings.quality,
      support: settings.supportEnabled,
      material: settings.material,
      pattern: settings.pattern,
      color: settings.color,
    };

    formDataToSubmit.append('settings_json', JSON.stringify(settingsJson));

    setIsUploading(true);
    setUploadProgress(0);
    toast.info('Uploading files and fetching quote...', { theme: 'colored', position: 'bottom-right' });

    try {
      const response = await axios.post('/upload', formDataToSubmit, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });

      const uploadedFiles: any[] = response.data.uploaded_files || [];
      const failedFiles: any[] = response.data.failed_files || [];

      // Update files with backend response
      const updatedFiles = files.map((item) => {
        const matchedFile = uploadedFiles.find((file) => file.filename === item.name);
        if (matchedFile) {
          return {
            ...item,
            status: 'Sliced ✔' as 'Sliced ✔',
            weight_grams: matchedFile.weight_grams,
            cost_LKR: matchedFile.cost_LKR,
            download_url: matchedFile.download_url,
            original_file_url: matchedFile.original_file_url,
          };
        }
        return item;
      });

      setFiles(updatedFiles);

      // Calculate total quote (sum of cost_LKR for all files multiplied by quantity)
      const totalQuote = uploadedFiles.reduce((acc, file) => acc + (file.cost_LKR || 0), 0) * parseInt(formData.quantity, 10);
      setQuote(totalQuote);

      if (uploadedFiles.length > 0) {
        toast.success('Files uploaded and sliced successfully!', {
          theme: 'colored',
          position: 'bottom-right',
        });
      }

      if (failedFiles.length > 0) {
        failedFiles.forEach((file) => {
          toast.error(`Failed to process ${file.filename}: ${file.error}`, {
            theme: 'colored',
            position: 'bottom-right',
          });
        });
      }
    } catch (error: any) {
      console.error('Upload Error:', error.response ? error.response.data : error.message);
      toast.error('Upload or slicing failed. Please check your files and try again.', {
        theme: 'colored',
        position: 'bottom-right',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadGCode = (file: UploadedFile) => {
    if (file.download_url) {
      window.open(file.download_url, '_blank');
    } else {
      toast.warning('Download link is not available.', {
        theme: 'colored',
        position: 'bottom-right',
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (updatedFiles.length === 0) {
      setQuote(0);
    }
    toast.info('File removed.', { theme: 'colored', position: 'bottom-right' });
  };

  const handleRemoveAll = () => {
    setFiles([]);
    setQuote(0);
    toast.info('All files have been removed.', { theme: 'colored', position: 'bottom-right' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error('Please upload at least one 3D model file.', {
        theme: 'colored',
        position: 'bottom-right',
      });
      return;
    }

    if (quote === 0) {
      toast.error('Please get a quote before submitting the order.', {
        theme: 'colored',
        position: 'bottom-right',
      });
      return;
    }

    const formDataToSubmit = new FormData();

    // Append files to the form data
    files.forEach((item) => formDataToSubmit.append('file', item.file));

    // Append form data
    formDataToSubmit.append('projectType', formData.projectType);
    formDataToSubmit.append('material', settings.material);
    formDataToSubmit.append('quantity', formData.quantity);
    formDataToSubmit.append('notes', formData.notes);
    formDataToSubmit.append('price', quote.toString());

    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post('http://localhost:3000/design/upload', formDataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Quote request submitted! We'll get back to you soon.", {
        theme: 'colored',
        position: 'bottom-right',
      });

      // Reset form
      setFiles([]);
      setSettings({
        material: 'PLA',
        support: 'None',
        supportEnabled: false,
        layerHeight: 0.2,
        quality: 'Standard Quality - 0.2 mm',
        pattern: 'Cubic',
        color: 'Red',
      });
      setFormData({
        projectType: '',
        quantity: '1',
        notes: '',
      });
      setQuote(0);
    } catch (error) {
      console.error('Form Submission Error:', error);
      toast.error('Failed to submit the form. Please try again.', {
        theme: 'colored',
        position: 'bottom-right',
      });
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const qualityProfiles: { name: string; value: number }[] = [
    { name: 'Super Quality - 0.12 mm', value: 0.12 },
    { name: 'Dynamic Quality - 0.16 mm', value: 0.16 },
    { name: 'Standard Quality - 0.2 mm', value: 0.2 },
    { name: 'Low Quality - 0.28 mm', value: 0.28 },
  ];

  const infillPatterns: string[] = [
    'Grid',
    'Lines',
    'Triangles',
    'Tri-Hexagon',
    'Cubic',
    'Cubic Subdivision',
    'Octet',
    'Quarter Cubic',
    'Concentric',
    'Zig Zag',
    'Cross',
    'Cross 3D',
    'Gyroid',
    'Lightning',
  ];

  // Persist settings and files in localStorage
  useEffect(() => {
    localStorage.setItem('uploadSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(
      'uploadedFiles',
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

  return (
    <>
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="py-12 px-6 lg:px-[10rem]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom 3D Printing Orders</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your 3D models and we'll bring them to life. Our expert team ensures quality prints with fast turnaround times.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Submit Your Order</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Upload Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload 3D Model (STL, OBJ, or FBX)
                      </label>
                      <div
                        {...getRootProps()}
                        className={`dropzone p-5 text-center border-2 border-dashed ${
                          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                        } rounded-lg cursor-pointer transition-colors duration-300`}
                      >
                        <input {...getInputProps()} />
                        <FaUpload size={50} color={isDragActive ? '#3B82F6' : '#6B7280'} />
                        <p className="mt-3 font-bold text-gray-700">
                          {isDragActive
                            ? 'Drop the files here...'
                            : 'Drag and drop files here, or click to select files'}
                        </p>
                        <em className="text-xs text-gray-500">(Only .stl, .obj, .3mf, .fbx files are accepted)</em>
                      </div>
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {files.map((item, index) => (
                            <div key={index} className="p-3 bg-gray-100 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-800">{item.name}</p>
                                  <p className="text-sm text-gray-500">{item.size}</p>
                                  <span
                                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                      item.status === 'Ready'
                                        ? 'bg-yellow-200 text-yellow-800'
                                        : item.status === 'Sliced ✔'
                                        ? 'bg-green-200 text-green-800'
                                        : 'bg-red-200 text-red-800'
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveFile(index)}
                                    className="flex items-center"
                                  >
                                    <FaTrash className="mr-1" /> Remove
                                  </Button>
                                  {item.status === 'Sliced ✔' && (
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() => handleDownloadGCode(item)}
                                      className="flex items-center"
                                    >
                                      <FaDownload className="mr-1" /> Download
                                    </Button>
                                  )}
                                </div>
                              </div>
                              {/* Display Weight and Cost if Sliced */}
                              {item.status === 'Sliced ✔' && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-700">
                                    <strong>Weight:</strong> {item.weight_grams} g
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    <strong>Cost per Model:</strong> {item.cost_LKR} LKR
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    <strong>Quantity:</strong> {formData.quantity}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    <strong>Total Cost:</strong> {(item.cost_LKR ?? 0) * parseInt(formData.quantity, 10)} LKR
                                  </p>
                                </div>
                              )}
                              {/* Display 3D Viewer if available */}
                              {item.status === 'Sliced ✔' && item.original_file_url && (
                                <div className="mt-3">
                                  <ErrorBoundary>
                                    <ThreeDViewer
                                      fileUrl={`http://localhost:5000${item.original_file_url}`}
                                    />
                                  </ErrorBoundary>
                                </div>
                              )}
                            </div>
                          ))}
                          {files.length > 0 && (
                            <div className="flex justify-end space-x-2">
                              <Button
                                onClick={handleGetQuote}
                                disabled={isUploading}
                                className="flex items-center"
                              >
                                <FaUpload className="mr-1" />
                                {isUploading ? 'Uploading...' : 'Get Quote'}
                              </Button>
                              <Button onClick={handleRemoveAll} variant="primary" className="flex items-center">
                                <FaTrash className="mr-1" /> Remove All
                              </Button>
                            </div>
                          )}
                          {/* Display upload progress */}
                          {isUploading && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Print Settings Section */}
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-4">Print Settings</h3>
                      <div className="space-y-4">
                        {/* Print Quality */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Print Quality
                          </label>
                          <select
                            name="quality"
                            value={settings.quality}
                            onChange={handleQualityChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                          >
                            {qualityProfiles.map((profile, index) => (
                              <option key={index} value={profile.name}>
                                {profile.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Material */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Material
                          </label>
                          <select
                            name="material"
                            value={settings.material}
                            onChange={handleSettingsChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                          >
                            <option value="PLA">PLA</option>
                            <option value="ABS">ABS</option>
                            <option value="PETG">PETG</option>
                          </select>
                        </div>

                        {/* Infill Pattern */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Infill Pattern
                          </label>
                          <select
                            name="pattern"
                            value={settings.pattern}
                            onChange={handleSettingsChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                          >
                            {infillPatterns.map((pattern, index) => (
                              <option key={index} value={pattern}>
                                {pattern}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Color */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color
                          </label>
                          <select
                            name="color"
                            value={settings.color}
                            onChange={handleSettingsChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                          >
                            <option value="Red">Red</option>
                            <option value="Black">Black</option>
                            <option value="White">White</option>
                          </select>
                        </div>

                        {/* Enable Support */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="supportEnabled"
                            id="supportEnabled"
                            checked={settings.supportEnabled}
                            onChange={handleSettingsChange}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                          <label htmlFor="supportEnabled" className="ml-2 block text-sm text-gray-700">
                            Enable Support
                          </label>
                        </div>

                        {/* Support Type */}
                        {settings.supportEnabled && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Support Type
                            </label>
                            <select
                              name="support"
                              value={settings.support}
                              onChange={handleSettingsChange}
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                            >
                              <option value="None">None</option>
                              <option value="Tree">Tree</option>
                              <option value="Normal">Normal</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Details Section */}
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-4">Order Details</h3>
                      <div className="space-y-4">
                        {/* Project Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Type
                          </label>
                          <select
                            name="projectType"
                            required
                            value={formData.projectType}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                          >
                            <option value="">Select a project type</option>
                            <option value="prototype">Prototype</option>
                            <option value="production">Production Run</option>
                            <option value="model">Display Model</option>
                            <option value="custom">Custom Project</option>
                          </select>
                        </div>

                        {/* Quantity */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            min="1"
                            required
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                          />
                        </div>

                        {/* Special Instructions */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Special Instructions
                          </label>
                          <textarea
                            name="notes"
                            rows={4}
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
                            placeholder="Any specific requirements or details..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quote Section */}
                    {quote !== 0 && (
                      <p className="mt-4 bg-blue-100 text-blue-800 font-semibold p-3 rounded-lg shadow-sm border border-blue-200">
                        Total Quote: {quote} LKR
                      </p>
                    )}

                    {/* Buttons */}
                    <div className="flex space-x-4">
                      <Button
                        onClick={handleGetQuote}
                        size="sm"
                        className="w-full flex items-center justify-center py-2 text-sm"
                        disabled={isUploading}
                      >
                        <FaUpload className="mr-1" /> Get Quote
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        className="w-full flex items-center justify-center py-2 text-sm"
                      >
                        Submit For Printing
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* How It Works Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">How It Works</h3>
                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Upload & Quote</h4>
                        <p className="mt-1 text-gray-600 text-sm">
                          Submit your model and receive a detailed quote within 24 hours
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Printer className="w-5 h-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Production</h4>
                        <p className="mt-1 text-gray-600 text-sm">
                          Our experts print your model with precision using industrial-grade printers
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Delivery</h4>
                        <p className="mt-1 text-gray-600 text-sm">
                          Receive your custom 3D print at your doorstep in just a few days
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CustomOrders;
