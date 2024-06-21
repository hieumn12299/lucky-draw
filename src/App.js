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
      const response = await axios.get(`http://localhost:5000/users/${name}`);
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
      let response = await axios.get('http://localhost:5000/users');
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
      let response = await axios.put(`http://localhost:5000/update/${name}`, {
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
    step === 1 ? <div className="max-w-[600px] mx-auto min-h-screen relative">
      <div className='absolute top-1/2 -translate-y-1/2 w-full'>
        {/* Responsive Email Input */}
        <label htmlFor="name" className="block mb-2">
          Tên:
        </label>
        <input
          type="name"
          id="name"
          value={name}
          className="border p-2 rounded-md w-full"
          placeholder="Tên lucky draw được cấp của bạn"
          onChange={(e) => setName(e.target.value)}
        />

        {/* Responsive Subscribe Button */}
        <button
          type='button'
          className="bg-blue-500 text-white p-2 rounded-md mt-4 w-full"
          onClick={async () => {
            try {
              await handleFindUser()
            } catch (error) {
              alert('Tên không hợp lệ');
            }
          }}
        >
          Đồng ý
        </button>
      </div>
    </div> : step === 2 ?
      <div className='flex flex-col justify-center p-12 max-w-[900px] mx-auto'>
        <h1 className='text-[50px] text-center py-4'> Lucky Draw </h1>
        <hr />
        <div className='flex justify-between flex-wrap gap-3 py-6'>
          {listBox.map((item, index) => {
            return (
              <div key={index} className='flex justify-center flex-col items-center gap-y-2 cursor-pointer' onClick={() => drawPrize(index)}>
                <img src="https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Gifts-and-Chocolates-PNG-/Transparent_White_Present_Box_with_Red_Bow_PNG_Clipart.png?" width={120} height={120} />
                <h2 id="message">Bấm để nhận quà</h2>
              </div>
            )
          })}
        </div>
      </div> :
      step === 3 ? <>
        <Confetti />
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="rounded-lg bg-gray-50 px-16 py-14">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-200 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="my-4 text-center text-3xl font-semibold text-gray-700">Congratuation!!!</h3>
          </div>
        </div>
      </> : <>
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="rounded-lg bg-gray-50 px-16 py-14">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-200 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20"><path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path></svg>
                </div>
              </div>
            </div>
            <h3 className="my-4 text-center text-3xl font-semibold text-gray-700">Tiếc quá không trúng mất rồi!!!</h3>
          </div>
        </div>
      </>

  );
}

export default App;