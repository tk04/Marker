import docSrc from "/docs.svg";

const EmptyProject = () => {
  return (
    <div className="mx-auto w-fit mb-20">
      <div className="flex flex-col -mt-20">
        <img src={docSrc} width={400} />
        <p className="text-neutral-600 text-[10px] -mt-10 m-auto">
          Illustrations by{" "}
          <a href="https://storyset.com/?open=true" target="_blank">
            Storyset
          </a>
        </p>
      </div>
    </div>
  );
};
export default EmptyProject;
