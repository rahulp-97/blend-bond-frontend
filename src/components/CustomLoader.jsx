const CustomLoader = () => {
    return (
        <div style={{ width: "100%", height: "100%", position: "absolute", textAlign: "center", zIndex: "1000" }}>
            <span className="loading loading-spinner loading-xl mt-52"></span>
        </div>
    )
};

export default CustomLoader;