import { BsTwitterX, BsLinkedin, BsInstagram, BsFacebook } from 'react-icons/bs';

const Footer = () => {
  return (
    <>
      <div className="relative top-0 bottom-0 h-[10vh] py-5 flex flex-col sm:flex-row  items-center justify-between  text-white bg-gray-800 sm:px-20">
        <div className="text-lg">Copyright 2024 || All right reserved</div>
        <div className="flex  justify-center gap-5 text-2xl ">
          <a className=" hover:text-yellow-500 transition-all ease-in-out duration-300">
            <BsFacebook />
          </a>
          <a className=" hover:text-yellow-500 transition-all ease-in-out duration-300">
            <BsTwitterX />
          </a>
          <a className=" hover:text-yellow-500 transition-all ease-in-out duration-300">
            <BsInstagram />
          </a>
          <a className=" hover:text-yellow-500 transition-all ease-in-out duration-300">
            <BsLinkedin />
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
