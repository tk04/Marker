import Apps from "./components/Main/Apps";

function App() {
  return (
    <div>
      <div className="max-w-4xl h-screen flex flex-col justify-center mx-auto px-10 lg:px-0">
        <h1 className="text-3xl font-semibold mb-10">Projects</h1>
        <Apps />
      </div>
    </div>
  );
}

export default App;
