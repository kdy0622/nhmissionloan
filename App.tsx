
import React, { useState } from 'react';
import { ChurchFormData, Step } from './types';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.START);
  const [formData, setFormData] = useState<ChurchFormData>({
    churchName: '',
    denomination: '',
    location: '',
    memberCount: '',
    currentLoanAmount: '',
    bankName: '',
    currentInterestRate: '',
    collaterals: Array.from({ length: 5 }, () => ({ id: uuidv4(), description: '' })),
    photo: null,
    managerName: '',
    position: '',
    phoneNumber: '',
    email: '',
    applicantName: '',
    agreement: false,
  });

  const updateFormData = (fields: Partial<ChurchFormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const handleAddCollateral = () => {
    setFormData(prev => ({
      ...prev,
      collaterals: [...prev.collaterals, { id: uuidv4(), description: '' }]
    }));
  };

  const handleCollateralChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      collaterals: prev.collaterals.map(c => c.id === id ? { ...c, description: value } : c)
    }));
  };

  const nextStep = () => {
    if (currentStep < Step.SUBMISSION) {
      setCurrentStep(prev => (prev + 1) as Step);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > Step.START) {
      setCurrentStep(prev => (prev - 1) as Step);
      window.scrollTo(0, 0);
    }
  };

  const handleDownloadForm = () => {
    const driveUrl = "https://drive.google.com/file/d/17_PpYUsPtVHESxcctlio-CpbbywMxjmq/view?usp=drive_link";
    window.open(driveUrl, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < Step.SUBMISSION) {
      nextStep();
    } else {
      if (!formData.agreement) {
        alert("약관에 동의하셔야 신청이 완료됩니다.");
        return;
      }
      
      const emailRecipient = 'nh170260-1@nonghyup.com';
      const subject = `[교회대출 특판신청] ${formData.churchName} / ${formData.applicantName}`;
      
      const collateralsList = formData.collaterals
        .filter(c => c.description.trim() !== "")
        .map((c, i) => `[담보${i + 1}] ${c.description}`)
        .join('\n');

      const body = `
[교회대출 특판 신청서 접수내역]

1. 교회 기본 정보
- 교회명: ${formData.churchName}
- 교단: ${formData.denomination}
- 소재지: ${formData.location}
- 출석교인수: ${formData.memberCount}명

2. 대출 및 재정 현황
- 기존 대출금액: ${formData.currentLoanAmount}원
- 금융기관명: ${formData.bankName}
- 현재 적용금리: ${formData.currentInterestRate}%

3. 담보물 소재지 (지번 목록)
${collateralsList || "입력된 담보물 정보가 없습니다."}

4. 교회 담당자 정보
- 담당자 성명: ${formData.managerName}
- 직분: ${formData.position}
- 전화번호: ${formData.phoneNumber}
- 이메일: ${formData.email}

5. 최종 확인
- 신청인 성명: ${formData.applicantName}
- 개인정보 수집 및 이용 동의: 완료

-----------------------------------------
수신처: ${emailRecipient}
본 메일은 서울축산농협 상계역지점 특판 시스템을 통해 자동 생성되었습니다.
      `;
      
      window.location.href = `mailto:${emailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      alert(`신청서 작성이 완료되었습니다.\n\n수신처: ${emailRecipient}\n확인 버튼을 누르면 메일 앱이 실행됩니다.\n메일 작성 화면에서 '보내기'를 눌러주셔야 최종 접수됩니다.`);
      setCurrentStep(Step.START);
    }
  };

  if (currentStep === Step.START) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-gray-900 break-keep">
        <section className="relative py-16 md:py-24 flex flex-col items-center justify-center bg-[#228B22] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-5xl w-full">
            <div className="inline-block bg-yellow-400 text-black px-4 py-1.5 rounded-full text-sm md:text-xl font-black mb-6 shadow-xl">
               2026년 한정 고금리 대환 프로젝트
            </div>
            <h1 className="text-3xl md:text-8xl font-extrabold mb-6 tracking-tighter leading-tight drop-shadow-lg whitespace-nowrap overflow-hidden text-ellipsis">
              농협 교회대출 특판
            </h1>
            <p className="text-lg md:text-4xl font-bold mb-10 text-yellow-300 drop-shadow-md whitespace-nowrap">
              "연 4.30%대 저금리로 대환하십시오"
            </p>
            
            <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 mb-10 md:14 shadow-2xl text-gray-800 border-4 border-yellow-400">
              <h3 className="text-xl md:text-3xl font-black mb-6 md:mb-10 text-[#228B22] flex items-center justify-center gap-2">
                <span className="text-2xl md:text-4xl">🚀</span> 특별 우대 혜택
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-10">
                <div className="flex flex-col items-center p-4 md:p-8 bg-green-50 rounded-2xl border-2 border-green-100 shadow-sm">
                  <span className="text-sm md:text-xl font-bold text-gray-500 mb-1">특별 우대 금리</span>
                  <span className="text-2xl md:text-5xl font-black text-red-600 italic tracking-tighter">연 4.30% ~</span>
                </div>
                <div className="flex flex-col items-center p-4 md:p-8 bg-green-50 rounded-2xl border-2 border-green-100 shadow-sm">
                  <span className="text-sm md:text-xl font-bold text-gray-500 mb-1">특판 총 한도</span>
                  <span className="text-2xl md:text-5xl font-black text-[#228B22] tracking-tighter">500억 원</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-dashed border-gray-300">
                <p className="text-lg md:text-2xl font-black text-gray-800 mb-1">대상: 수도권(서울·경기·인천) 교회</p>
                <p className="text-sm md:text-lg text-red-600 font-bold italic underline">
                  (기존 서울축산농협 거래처 제외)
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={nextStep}
                className="px-10 py-5 md:px-16 md:py-8 bg-yellow-400 text-black text-xl md:text-3xl font-black rounded-full shadow-2xl hover:scale-105 transition-transform border-b-6 md:border-b-8 border-yellow-600 active:translate-y-1"
              >
                상담 신청하기
              </button>
              <button 
                onClick={handleDownloadForm}
                className="px-8 py-5 md:px-12 md:py-8 bg-black text-yellow-400 text-lg md:text-2xl font-black rounded-full shadow-xl hover:bg-gray-800 transition-all border-2 border-yellow-400 flex items-center justify-center gap-2"
              >
                📥 양식 다운로드
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-black mb-8 text-[#228B22] italic">서울축산농협(상계역지점)</h2>
            <div className="space-y-4 md:space-y-8 text-lg md:text-2xl text-gray-700 leading-relaxed font-medium">
              <p>서울 전역 <span className="font-bold text-[#228B22] underline underline-offset-4 md:underline-offset-8">28개 금융 점포</span> 운영</p>
              <p>대한민국 최대 규모의 지역농협</p>
              <p className="bg-green-50 inline-block px-4 py-1 rounded-lg text-sm md:text-xl">수십 년 노하우의 교회 전문 금융 파트너</p>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-black text-center mb-12 text-[#228B22]">📞 상담 창구 안내</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              <ConsultCard title="과장" name="정창운" tel="02-2181-5228" />
              <ConsultCard title="부지점장" name="장정숙" tel="02-2181-5221" isHighlight />
              <ConsultCard title="지점장" name="김대윤" tel="010-7399-5380" />
            </div>
            <div className="mt-10 md:mt-16 bg-white p-6 md:p-12 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border-2 border-gray-100 text-center">
              <h3 className="text-lg md:text-3xl font-black mb-4 text-[#228B22]">📠 팩스 접수 안내</h3>
              <p className="text-xl md:text-2xl font-bold text-gray-700 mb-4 tracking-tighter">팩스: <a href="tel:02-3392-3916" className="text-[#228B22] font-black">02-3392-3916</a></p>
              <p className="text-sm md:text-xl text-gray-500">양식 작성 후 팩스 송부 시 신속히 연락드립니다.</p>
            </div>
          </div>
        </section>

        <footer className="bg-white py-10 md:py-16 text-center text-gray-400 border-t border-gray-100">
           <p className="text-sm md:text-xl font-bold">© 2026 서울축산농협 상계역지점</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 text-gray-900 break-keep">
      <header className="bg-[#228B22] py-10 md:py-14 px-4 text-center text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex justify-center items-center pointer-events-none text-9xl">✝</div>
        <div className="relative z-10">
          <div className="text-4xl md:text-6xl mb-2">✝</div>
          <h1 className="text-2xl md:text-5xl font-black mb-1 tracking-tight">특판 대출 신청</h1>
          <p className="text-sm md:text-2xl font-bold opacity-90">서울축산농협 상계역지점 전용</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-6 md:mt-10 p-5 md:p-12 bg-white shadow-2xl rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-200">
        <div className="flex justify-between mb-10 md:16 overflow-x-auto py-2 gap-2 no-scrollbar">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex flex-col items-center min-w-[50px] md:min-w-[70px] flex-1">
              <div className={`w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm md:text-2xl font-black mb-1.5 transition-all duration-300 ${currentStep >= s ? 'bg-[#228B22] text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
              <span className={`text-[10px] md:text-sm font-black whitespace-nowrap ${currentStep >= s ? 'text-[#228B22]' : 'text-gray-400'}`}>Step {s}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
          {currentStep === Step.CHURCH_INFO && (
            <div className="space-y-6 md:space-y-8 animate-fadeIn">
              <h2 className="text-xl md:text-3xl font-black border-l-4 md:border-l-8 border-[#228B22] pl-3 md:pl-6 mb-6 md:10">1. 교회 기본 정보</h2>
              <InputGroup label="교회명" value={formData.churchName} onChange={(v) => updateFormData({ churchName: v })} placeholder="교회 공식 명칭" />
              <InputGroup label="소속 교단" value={formData.denomination} onChange={(v) => updateFormData({ denomination: v })} placeholder="교단명" />
              <InputGroup label="소재지" value={formData.location} onChange={(v) => updateFormData({ location: v })} placeholder="교회 주소" />
              <InputGroup label="출석 인원" value={formData.memberCount} onChange={(v) => updateFormData({ memberCount: v })} type="number" placeholder="장년 출석 인원" />
            </div>
          )}

          {currentStep === Step.LOAN_STATUS && (
            <div className="space-y-6 md:space-y-8 animate-fadeIn">
              <h2 className="text-xl md:text-3xl font-black border-l-4 md:border-l-8 border-[#228B22] pl-3 md:pl-6 mb-6 md:10">2. 대출 및 재정 현황</h2>
              <InputGroup label="대출금액(원)" value={formData.currentLoanAmount} onChange={(v) => updateFormData({ currentLoanAmount: v })} type="number" placeholder="총 대출 잔액" />
              <InputGroup label="거래 금융기관" value={formData.bankName} onChange={(v) => updateFormData({ bankName: v })} placeholder="이용 중인 은행명" />
              <InputGroup label="현재 금리(%)" value={formData.currentInterestRate} onChange={(v) => updateFormData({ currentInterestRate: v })} placeholder="예: 6.5" />
            </div>
          )}

          {currentStep === Step.COLLATERAL && (
            <div className="space-y-6 md:space-y-8 animate-fadeIn">
              <h2 className="text-xl md:text-3xl font-black border-l-4 md:border-l-8 border-[#228B22] pl-3 md:pl-6 mb-6 md:10">3. 담보물 정보 (지번)</h2>
              <div className="space-y-4 md:space-y-6">
                {formData.collaterals.map((collateral, index) => (
                  <div key={collateral.id} className="flex gap-2 md:gap-4 items-center group">
                    <span className="text-lg md:text-2xl font-black text-[#228B22] w-8 md:w-12 text-center">{index + 1}</span>
                    <input 
                      type="text" 
                      className="flex-1 p-3 md:p-5 border-2 border-gray-200 rounded-xl md:rounded-2xl text-base md:text-xl font-bold focus:border-[#228B22] outline-none transition-all shadow-sm"
                      placeholder="담보물 지번 주소"
                      value={collateral.description}
                      onChange={(e) => handleCollateralChange(collateral.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                onClick={handleAddCollateral}
                className="w-full mt-4 py-4 md:py-6 border-2 md:border-4 border-dashed border-[#228B22] rounded-xl md:rounded-3xl text-[#228B22] font-black text-lg md:text-2xl hover:bg-green-50 active:scale-95 transition-all"
              >
                + 입력란 추가
              </button>
            </div>
          )}

          {currentStep === Step.ATTACHMENT && (
            <div className="space-y-6 md:space-y-8 animate-fadeIn">
              <h2 className="text-xl md:text-3xl font-black border-l-4 md:border-l-8 border-[#228B22] pl-3 md:pl-6 mb-6 md:10">4. 담당자 정보</h2>
              <div className="bg-gray-50 p-4 md:p-8 rounded-2xl md:rounded-3xl space-y-6 md:space-y-8 shadow-inner border border-gray-100">
                <InputGroup label="성명" value={formData.managerName} onChange={(v) => updateFormData({ managerName: v })} placeholder="담당자 성명" />
                <InputGroup label="직분" value={formData.position} onChange={(v) => updateFormData({ position: v })} placeholder="목사, 장로 등" />
                <InputGroup label="전화번호" value={formData.phoneNumber} onChange={(v) => updateFormData({ phoneNumber: v })} placeholder="010-0000-0000" />
                <InputGroup label="이메일" value={formData.email} onChange={(v) => updateFormData({ email: v })} type="email" placeholder="이메일 주소" />
              </div>
            </div>
          )}

          {currentStep === Step.SUBMISSION && (
            <div className="space-y-8 md:space-y-10 animate-fadeIn">
              <h2 className="text-xl md:text-3xl font-black border-l-4 md:border-l-8 border-[#228B22] pl-3 md:pl-6 mb-6 md:10">5. 신청 동의 및 제출</h2>
              <div className="p-4 md:p-8 bg-gray-50 border-2 border-gray-100 rounded-2xl md:rounded-3xl text-sm md:text-lg leading-relaxed text-gray-700">
                <p>본 정보는 대출 상담 목적으로만 사용되며 법적으로 철저히 보호됩니다.</p>
              </div>
              <div className="flex items-center gap-3 md:gap-5 bg-green-50 p-4 md:p-8 rounded-2xl md:rounded-3xl border-2 border-[#228B22]">
                <input type="checkbox" id="agree" className="w-6 h-6 md:w-8 md:h-8 accent-[#228B22] cursor-pointer" checked={formData.agreement} onChange={(e) => updateFormData({ agreement: e.target.checked })} />
                <label htmlFor="agree" className="text-lg md:text-2xl font-black cursor-pointer select-none">신청 및 약관에 동의합니다.</label>
              </div>
              <InputGroup label="최종 신청인" value={formData.applicantName} onChange={(v) => updateFormData({ applicantName: v })} placeholder="성함 입력" />
            </div>
          )}

          <div className="flex gap-3 md:gap-4 pt-6 sticky bottom-4 bg-white/95 backdrop-blur-sm p-3 md:p-4 rounded-2xl shadow-xl z-20">
            <button 
              type="button" 
              onClick={prevStep} 
              className="flex-1 py-4 md:py-6 bg-gray-200 text-gray-700 rounded-xl md:rounded-2xl text-lg md:text-2xl font-black active:scale-95"
            >
              이전
            </button>
            <button 
              type="submit" 
              className="flex-[2] py-4 md:py-6 bg-[#228B22] text-white rounded-xl md:rounded-2xl text-lg md:text-2xl font-black shadow-xl active:scale-95 border-b-4 md:border-b-8 border-green-800"
            >
              {currentStep === Step.SUBMISSION ? '신청 완료' : '다음 단계'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

const ConsultCard: React.FC<{title: string, name: string, tel: string, isHighlight?: boolean}> = ({title, name, tel, isHighlight}) => (
  <a 
    href={`tel:${tel}`} 
    className={`p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-lg text-center transition-all group border-2 ${isHighlight ? 'bg-white border-[#228B22]' : 'bg-white border-transparent'}`}
  >
    <span className="text-gray-400 font-bold text-xs md:text-lg mb-1 block">{title}</span>
    <h4 className="text-xl md:text-3xl font-black mb-2 md:mb-4 group-hover:text-[#228B22] whitespace-nowrap">{name}</h4>
    <div className={`text-lg md:text-2xl font-black ${isHighlight ? 'text-[#228B22]' : 'text-gray-700'}`}>{tel}</div>
  </a>
);

const InputGroup: React.FC<{label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string}> = ({label, value, onChange, type="text", placeholder}) => (
  <div className="flex flex-col gap-1.5 md:gap-3">
    <label className="text-lg md:text-2xl font-black text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full p-4 md:p-6 border-2 border-gray-200 rounded-xl md:rounded-2xl text-lg md:text-2xl font-bold focus:border-[#228B22] outline-none transition-all shadow-sm"
      placeholder={placeholder}
      required
    />
  </div>
);

export default App;
