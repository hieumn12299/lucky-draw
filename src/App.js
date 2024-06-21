import axios from 'axios';
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

function App() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [listBox, setListBox] = useState(0);
  const [isLucky, setIsLucky] = useState(false);

  const handleFindUser = async () => {
    try {
      const response = await axios.get(`https://be-lucky.onrender.com/users/${name}`);
      if (response.data.isSubmit) {
        if (response.data.isLucky) {
          return setStep(3);
        }
        else {
          return setStep(4);
        }
      }
      setStep(2);
    } catch (error) {
      alert('Tên không hợp lệ');
      return error;
    }
  };

  const getAll = async () => {
    try {
      let response = await axios.get('https://be-lucky.onrender.com/users');
      return response.data;
    } catch (error) {
      return error;
    }
  }

  useEffect(() => {
    getAll().then((data) => {
      const result = data.filter((item, index) => {
        return !item.isLucky && !item.isSubmit
      });
      const result2 = data.filter((item, index) => {
        return item.isLucky && item.isSubmit
      });
      setIsLucky(!!result2.length)
      setListBox(result);
    });

  }, [])

  const drawPrize = (boxIndex) => {
    const totalBoxes = listBox.length;
    let probabilities = [];
    // Tính toán tỷ lệ trúng thưởng cho từng box
    if (totalBoxes === 3) {
      probabilities = [0.3333, 0.3333, 0.3333];
    } else if (totalBoxes === 2) {
      probabilities = [0.5, 0.5];
    } else if (totalBoxes === 1) {
      probabilities = [1.0];
    }

    if (Math.random() <= probabilities[boxIndex] && !isLucky) {
      const winner = listBox[boxIndex];
      handleSubmit(true);
    } else {
      handleSubmit(false);
    }
  };

  const handleSubmit = async (status) => {
    try {
      let response = await axios.put(`https://be-lucky.onrender.com/update/${name}`, {
        isSubmit: true,
        isLucky: status
      });
      if (status) {
        setStep(3);
        return;
      } else {
        setStep(4);
        return;
      }
    } catch (error) {
      return error;
    }
  }

  return (
    <div className='bg-[#f1dfef]'>
      <div className='bg-white/60 fixed top-0 left-0 h-screen w-screen'></div>
      <div className='bg-hero-pattern bg-center bg-no-repeat min-h-screen'>
        {step === 1 ? <div className="max-w-[600px] px-2 mx-auto min-h-screen relative">
          <div className='absolute top-1/2 h-40 -translate-y-1/2 w-full'>
            {/* Responsive Email Input */}
            <div className='flex justify-center w-full'>
              <label htmlFor="name" className="inline-block mx-auto px-2 font-bold bg-[#f1dfef] mb-4 text-[32px] text-center text-[#c53f78]">
              #MEMECUOIHEHE
            </label>
            </div>
            <input
              type="name"
              id="name"
              value={name}
              className="border p-2 rounded-md w-full"
              placeholder="Hãy nhập tên của bạn vào đây nè!!!"
              onChange={(e) => setName(e.target.value)}
            />

            {/* Responsive Subscribe Button */}
            <button
              type='button'
              className="bg-[#c53f78] text-[#f1dfef] font-bold p-2 rounded-md mt-4 w-full"
              onClick={async () => {
                try {
                  await handleFindUser()
                } catch (error) {
                  alert('Tên không hợp lệ');
                }
              }}
            >
              ĐỒNG Ý
            </button>
          </div>
        </div> : step === 2 ?
          <div className='flex flex-col justify-center px-2 min-w-[100vw] md:min-w-[600px] max-w-screen fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
            <div className='flex justify-center w-full'>
              <label htmlFor="name" className="inline-block mx-auto px-2 font-bold bg-[#f1dfef] mb-4 text-[30px] md:text-[50px] text-center text-[#c53f78]">
              ✨ LUCKY LUCKY ✨
            </label>
            </div>
            <hr />
            <div className='flex justify-evenly md:justify-between flex-wrap gap-3 py-6'>
              {listBox.map((item, index) => {
                return (
                  <div key={index} className='flex justify-center flex-col items-center gap-y-2 cursor-pointer' onClick={() => drawPrize(index)}>
                    <img src="https://pngfre.com/wp-content/uploads/Gift-18.png" className='md:w-60 md:h-60 w-[120px] h-[120px]' />
                    <h2 id="message">NHẬN QUÀ</h2>
                  </div>
                )
              })}
            </div>
          </div> :
          step === 3 ? <>
            <Confetti />
            <div className="flex md:w-auto w-[calc(100vw-10px)] items-center justify-center fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
              <div className="rounded-lg bg-gray-50 px-8 py-8 md:px-12 md:py-12">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-200 p-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="my-4 text-center font-semibold text-gray-700 text-[20px] md:text-[30px]">MỪNG BÀ NHA!<br/>✨ TRÚNG QUÀ RÙI NÈ! ✨</h3>
              </div>
            </div>
          </> : <>
            <div className="flex md:w-auto w-[calc(100vw-10px)] items-center justify-center fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
              <div className="rounded-lg bg-gray-50 px-8 py-8 md:px-12 md:py-12">
                <div className="flex justify-center">
                  <span className='text-[63px]'>😞</span>
                </div>
                <h3 className="my-4 text-center font-semibold text-gray-700 text-[20px] md:text-[30px]">TIẾC QUÁ, <br/> HẸN BÀ LẦN SAU NHA!!!</h3>
              </div>
            </div>
          </>}
      </div>
    </div>

  );
}

export default App;