import React, { useEffect, useState } from "react";
import { extractFileNames } from "../helper/commonHelperFunc";
import { ImBin } from "react-icons/im";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const InputField = ({
  type,
  className,
  value,
  name,
  onchange,
  placeholder,
  autocomplete,
  max,
  disabled,
}) => {
  return (
    <>
      <input
        type={type}
        className={className}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onchange}
        autoComplete={autocomplete}
        max={max}
        disabled={disabled}
      />
    </>
  );
};
const CustomSelect = ({
  label,
  options = [],
  value,
  onChange,
  name,
  placeholder,
  isDisabled = false,
  customClass = "",
  imp,
}) => {
  return (
    <>
      {label && (
        <div className="font-semibold">
          {label}
          {imp ? <span className="text-red-500">*</span> : ""}
        </div>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`select-input ${customClass}`}
        disabled={isDisabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

const SelectInput = ({
  label,
  options = [],
  value,
  onChange,
  name,
  placeholder,
  isDisabled = false,
  customClass = "",
  imp,
}) => {
  return (
    <>
      {label && (
        <div className="font-semibold">
          {label}
          {imp ? <span className="text-red-500">*</span> : ""}
        </div>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`select-input ${customClass}`}
        disabled={isDisabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

const CustomInput = ({
  type,
  className,
  onChange,
  value,
  name,
  placeHolder,
  checked,
  handleClick,
  errorMessage,
  title,
  imp,
  customText,
}) => {
  return (
    <div className="flex flex-col mt-3">
      <span className="font-semibold pb-3 ">
        {" "}
        {title} <span className="text-red-500">{imp ? "*" : ""}</span>
      </span>
      <input
        type={type}
        className={`${className} ${errorMessage ? "border-red-500" : ""}`}
        onChange={onChange}
        onClick={handleClick}
        value={value}
        placeholder={placeHolder}
        checked={checked}
        name={name}
      />

      {errorMessage && (
        <span className="text-red-500 text-sm mt-1">{errorMessage}</span>
      )}
    </div>
  );
};

const GroupedInput = ({
  title,
  stateName,
  errors,
  onChange,
  leftFields,
  rightFields,
}) => {
  const renderField = (field) => {
    if (field.type === "select") {
      return (
        <div key={field.name} className="flex flex-col gap-2 mt-4">
          <label className="font-medium">
            {field.label}{" "}
            <span className="text-red-500">{field.required ? "*" : ""}</span>
          </label>
          <select
            name={field.name}
            value={stateName[field.name]}
            onChange={onChange}
            className="w-full h-10 bg-white rounded-md px-3 outline-none "
          >
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
           
          </select>
          {field.customText && (
              <span className="font-medium text-[13px] text-black">{field.customText}</span>
            )}
          {errors[field.name] && (
            <span className="text-red-500 text-sm">{errors[field.name]}</span>
          )}
        </div>
      );
    }
    // Default: Render input field
    return (
      <>
        <CustomInput
          key={field.name}
          title={field.label}
          imp={field.required}
          className="w-full h-10 bg-white rounded-md px-3 outline-none "
          type={field.type}
          name={field.name}
          placeHolder={field.placeholder}
          value={stateName[field?.name]}
          onChange={onChange}
          errorMessage={errors[field?.name]}
        />
      </>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="flex gap-20 items-start">
        {/* Left Column */}
        <div className="flex flex-col gap-4 w-[30%]">
          {leftFields?.map((field) => renderField(field))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 w-[30%]">
          {rightFields?.map((field) => renderField(field))}
        </div>
      </div>
    </div>
  );
};

const FileUpload = ({
  label = "Upload File",
  acceptedFormats = ["image/jpeg", "image/png", "application/pdf"],
  onFileSelect,
  deleteFile,
  name,
  customClass,
  errorMessage = "Please use JPG, JPEG, PNG, and PDF format.",
  fileUrl,
  maxFileSizeMB = 5,
  imp,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(fileUrl || null);
  const [fileName, setFileName] = useState("No file selected");

  useEffect(() => {
    if (fileUrl) {
      const extractedFileName = extractFileNames(fileUrl);
      setFileName(extractedFileName);
      setPreviewUrl(fileUrl);
    }
  }, [fileUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (!acceptedFormats.includes(file.type)) {
        setError(errorMessage);
        setSelectedFile(null);
        setPreviewUrl(null);
        setFileName("No file selected");
        return;
      }

      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > maxFileSizeMB) {
        setError(`File size should not exceed ${maxFileSizeMB}MB`);
        setSelectedFile(null);
        setPreviewUrl(null);
        setFileName("No file selected");
        return;
      }

      setSelectedFile(file);
      setError("");
      setPreviewUrl(URL.createObjectURL(file));
      setFileName(file.name);

      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleDelete = () => {
    if (deleteFile) {
      deleteFile();
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName("No file selected");
  };

  const handlePreview = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  return (
    <div className={`flex flex-col gap-2 font-poppins ${customClass}`}>
      <label className="text-[14px] text-black mt-3">
        {label} {imp ? <span className="text-primary">*</span> : ""}
      </label>
      <div className="flex md:flex-row-reverse sm:flex-col items-center gap-2 ">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id={`file-input-${name}`}
          name={name}
          disabled={!!selectedFile || fileUrl}
          accept={acceptedFormats.join(",")}
        />
        <label
          htmlFor={`file-input-${name}`}
          className={`px-4 py-2 ${
            selectedFile || fileUrl
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary text-white"
          } border rounded cursor-pointer`}
        >
          Browse
        </label>
        <div
          className="flex-1 px-4 py-2 border border-gray-300 text-[14px] rounded text-black bg-input cursor-pointer"
          onClick={handlePreview}
        >
          {fileName.slice(0, 28)} {/* Display the file name */}
        </div>
        {(selectedFile || fileUrl) && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-2 py-2 bg-primary text-white rounded"
          >
            <ImBin />
          </button>
        )}
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <small className="text-gray-500">{errorMessage}</small>
    </div>
  );
};

const ToggleButton = ({ value, name, onChange, checkedToggle }) => {
  const handleToggleChange = () => {
    const newStatus = !checkedToggle ? "approved" : "send";
    onChange(newStatus);
  };
  return (
    <label className="relative inline-block w-14 h-8">
      <input
        type="checkbox"
        className="peer opacity-0 w-0 h-0"
        value={value}
        name={name}
        onChange={handleToggleChange}
        checked={checkedToggle}
      />
      <span className="absolute inset-0 bg-purple-300 rounded-full transition-all duration-300 ease-in-out peer-checked:bg-green-600"></span>
      <span className="absolute left-0.5 bottom-0.5 w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out peer-checked:translate-x-6"></span>
    </label>
  );
};
const ImageComponent = ({ src, alt, className, fallbackSrc }) => {
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = () => {
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    } else {
      setImageSrc(profilePic);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      className={className}
      onError={handleError}
    />
  );
};

const PasswordField = ({
  name,
  value,
  handleInput,
  showPassword,
  toggleVisibility,
  error,
  label,
}) => {
  return (
    <>
      <div className=" relative font-poppins">
        <span className="text-black font-semibold text-[14px]">{label}*</span>
        <CustomInput
          className="w-full h-12 bg-input text-body rounded-md  px-3 outline-none placeholder:text-[16px]"
          name={name}
          value={value}
          onChange={handleInput}
          type={showPassword ? "text" : "password"}
          placeHodler={label}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute inset-y-0 right-3 top-10 text-[18px] flex items-center"
        >
          {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
        </button>
        {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
      </div>
    </>
  );
};
export {
  SelectInput,
  CustomSelect,
  InputField,
  CustomInput,
  GroupedInput,
  FileUpload,
  ToggleButton,
  ImageComponent,
  PasswordField,
};

export default InputField;
