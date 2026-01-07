
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
      <div className="flex flex-col min-h-screen bg-white text-gray-900">
        <section className="relative py-24 flex flex-col items-center justify-center bg-[#228B22] text-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-5xl w-full">
            <div className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-full text-xl font-black mb-8 shadow-xl">
               2026년 한정 고금리 대환 프로젝트
            </div>
            <h1 className="text-5xl md:text-8xl font-extrabold mb-8 tracking-tighter leading-tight drop-shadow-lg">
              농협 교회대출 특판
            </h1>
            <p className="text-2xl md:text-4xl font-bold mb-12 text-yellow-300 drop-shadow-md">
              "연 4.30%대 저금리로 지금 바로 갈아타십시오!"
            </p>
            
            <div className="bg-white rounded-[2rem] p-10 mb-14 shadow-2xl text-gray-800 border-4 border-yellow-400">
              <h3 className="text-3xl font-black mb-10 text-[#228B22] flex items-center justify-center gap-2">
                <span className="text-4xl">🚀</span> 특별 우대 혜택
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="flex flex-col items-center p-8 bg-green-50 rounded-2xl border-2 border-green-100 shadow-sm">
                  <span className="text-xl font-bold text-gray-500 mb-2">특별 우대 금리</span>
                  <span className="text-5xl font-black text-red-600 italic tracking-tighter">연 4.30% ~</span>
                </div>
                <div className="flex flex-col items-center p-8 bg-green-50 rounded-2xl border-2 border-green-100 shadow-sm">
                  <span className="text-xl font-bold text-gray-500 mb-2">특판 총 한도</span>
                  <span className="text-5xl font-black text-[#228B22] tracking-tighter">500억 원</span>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                <p className="text-2xl font-black text-gray-800 mb-2">대상: 수도권(서울·경기·인천) 소재 교회</p>
                <p className="text-lg text-red-600 font-bold italic underline">
                  (기존 서울축산농협 거래처는 금차 특판 제외)
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button 
                onClick={nextStep}
                className="px-16 py-8 bg-yellow-400 text-black text-3xl font-black rounded-full shadow-2xl hover:scale-105 transition-transform border-b-8 border-yellow-600 active:translate-y-1"
              >
                상담 신청하기
              </button>
              <button 
                onClick={handleDownloadForm}
                className="px-12 py-8 bg-black text-yellow-400 text-2xl font-black rounded-full shadow-xl hover:bg-gray-800 transition-all border-2 border-yellow-400 flex items-center justify-center gap-3"
              >
                📥 양식 다운로드
              </button>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-12 text-[#228B22] italic">대한민국 최대 규모, 서울축산농협</h2>
            <div className="space-y-8 text-2xl text-gray-700 leading-relaxed font-medium">
              <p>서울축산농협은 서울 전역에 <span className="font-bold text-[#228B22] underline underline-offset-8">28개의 금융 거점</span>을 운영하는</p>
              <p>명실상부 대한민국 최대 규모의 지역농협입니다.</p>
              <p className="bg-green-50 inline-block px-4 py-2 rounded-lg">교회의 든든한 금융 파트너로서 수십 년의 노하우를 제공합니다.</p>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-16 text-[#228B22]">📞 대환 대출 전담 상담 창구 (상계역지점)</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <ConsultCard title="과장" name="정창운" tel="02-2181-5228" />
              <ConsultCard title="부지점장" name="장정숙" tel="02-2181-5221" isHighlight />
              <ConsultCard title="지점장" name="김대윤" tel="010-7399-5380" />
            </div>
            <div className="mt-16 bg-white p-12 rounded-[2rem] shadow-xl border-2 border-gray-100 text-center">
              <h3 className="text-3xl font-black mb-6 text-[#228B22]">📠 온라인 및 팩스 접수 안내</h3>
              <p className="text-2xl font-bold text-gray-700 mb-6">사무실 팩스: <a href="tel:02-3392-3916" className="text-[#228B22] font-black hover:underline">02-3392-3916</a></p>
              <p className="text-xl text-gray-500 leading-relaxed">온라인 접수가 어려우신 경우, 상단의 <span className="font-bold text-black">'양식 다운로드'</span> 후</p>
              <p className="text-xl text-gray-500">작성하시어 팩스로 보내주시면 신속히 연락드리겠습니다.</p>
            </div>
          </div>
        </section>

        <footer className="bg-white py-16 text-center text-gray-400 border-t border-gray-100">
           <p className="text-xl font-bold">© 2026 서울축산농협 상계역지점</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 text-gray-900">
      <header className="bg-[#228B22] py-14 px-4 text-center text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex justify-center items-center pointer-events-none text-9xl">✝</div>
        <div className="relative z-10">
          <div className="text-6xl mb-4">✝</div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">특판 대출 신청 시스템</h1>
          <p className="text-xl md:text-2xl font-bold opacity-90">서울축산농협 상계역지점 대환 전용</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-10 p-8 md:p-12 bg-white shadow-2xl rounded-[2.5rem] border border-gray-200">
        <div className="flex justify-between mb-16 overflow-x-auto py-4 gap-4 no-scrollbar">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex flex-col items-center min-w-[70px] flex-1">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black mb-3 transition-all duration-300 ${currentStep >= s ? 'bg-[#228B22] text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
              <span className={`text-sm font-black whitespace-nowrap ${currentStep >= s ? 'text-[#228B22]' : 'text-gray-400'}`}>Step {s}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {currentStep === Step.CHURCH_INFO && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-black border-l-8 border-[#228B22] pl-6 mb-10">1. 교회 기본 정보</h2>
              <InputGroup label="교회명" value={formData.churchName} onChange={(v) => updateFormData({ churchName: v })} placeholder="교회 공식 명칭" />
              <InputGroup label="소속 교단" value={formData.denomination} onChange={(v) => updateFormData({ denomination: v })} placeholder="예: 대한예수교장로회(통합)" />
              <InputGroup label="소재지 (주소)" value={formData.location} onChange={(v) => updateFormData({ location: v })} placeholder="교회 소재지 주소" />
              <InputGroup label="출석 장년 교인수" value={formData.memberCount} onChange={(v) => updateFormData({ memberCount: v })} type="number" placeholder="평균 장년 출석 인원" />
            </div>
          )}

          {currentStep === Step.LOAN_STATUS && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-black border-l-8 border-[#228B22] pl-6 mb-10">2. 대출 및 재정 현황</h2>
              <InputGroup label="기존 대출금액 (원)" value={formData.currentLoanAmount} onChange={(v) => updateFormData({ currentLoanAmount: v })} type="number" placeholder="현재 총 대출 잔액" />
              <InputGroup label="현재 거래 금융기관" value={formData.bankName} onChange={(v) => updateFormData({ bankName: v })} placeholder="현재 이용 중인 은행명" />
              <InputGroup label="현재 적용 금리 (%)" value={formData.currentInterestRate} onChange={(v) => updateFormData({ currentInterestRate: v })} placeholder="예: 6.5" />
            </div>
          )}

          {currentStep === Step.COLLATERAL && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-black border-l-8 border-[#228B22] pl-6 mb-10">3. 담보물 정보 (지번 목록)</h2>
              <div className="space-y-6">
                {formData.collaterals.map((collateral, index) => (
                  <div key={collateral.id} className="flex gap-4 items-center group">
                    <span className="text-2xl font-black text-[#228B22] w-12 text-center group-hover:scale-110 transition-transform">{index + 1}</span>
                    <input 
                      type="text" 
                      className="flex-1 p-5 border-2 border-gray-200 rounded-2xl text-xl font-bold focus:border-[#228B22] focus:ring-4 focus:ring-green-100 outline-none transition-all shadow-sm"
                      placeholder="담보물 소재지 및 지번 주소"
                      value={collateral.description}
                      onChange={(e) => handleCollateralChange(collateral.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                onClick={handleAddCollateral}
                className="w-full mt-6 py-6 border-4 border-dashed border-[#228B22] rounded-3xl text-[#228B22] font-black text-2xl hover:bg-green-50 active:scale-95 transition-all"
              >
                + 담보물 입력란 추가
              </button>
            </div>
          )}

          {currentStep === Step.ATTACHMENT && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-3xl font-black border-l-8 border-[#228B22] pl-6 mb-10">4. 교회 담당자 정보</h2>
              <div className="bg-gray-50 p-8 rounded-3xl space-y-8 shadow-inner border border-gray-100">
                <InputGroup label="성명" value={formData.managerName} onChange={(v) => updateFormData({ managerName: v })} placeholder="담당자 실명" />
                <InputGroup label="직분" value={formData.position} onChange={(v) => updateFormData({ position: v })} placeholder="목사, 장로, 회계 등" />
                <InputGroup label="전화번호" value={formData.phoneNumber} onChange={(v) => updateFormData({ phoneNumber: v })} placeholder="010-0000-0000" />
                <InputGroup label="이메일" value={formData.email} onChange={(v) => updateFormData({ email: v })} type="email" placeholder="email@example.com" />
              </div>
            </div>
          )}

          {currentStep === Step.SUBMISSION && (
            <div className="space-y-10 animate-fadeIn">
              <h2 className="text-3xl font-black border-l-8 border-[#228B22] pl-6 mb-10">5. 최종 확인 및 제출</h2>
              <div className="p-8 bg-gray-50 border-2 border-gray-100 rounded-3xl text-lg leading-relaxed text-gray-700 font-medium">
                <p className="font-bold text-xl mb-4 text-black">개인정보 수집 및 이용 동의</p>
                <p>기재하신 정보는 농협 교회대출 상담 및 한도 조회용으로만 엄격히 사용되며, 관계 법령에 따라 철저히 보호됩니다.</p>
              </div>
              <div className="flex items-center gap-5 bg-green-50 p-8 rounded-3xl border-2 border-[#228B22]">
                <input type="checkbox" id="agree" className="w-8 h-8 accent-[#228B22] cursor-pointer" checked={formData.agreement} onChange={(e) => updateFormData({ agreement: e.target.checked })} />
                <label htmlFor="agree" className="text-2xl font-black cursor-pointer select-none">상기 내용을 확인하였으며 신청에 동의합니다.</label>
              </div>
              <InputGroup label="신청인 성함" value={formData.applicantName} onChange={(v) => updateFormData({ applicantName: v })} placeholder="최종 신청 확인자 성함" />
            </div>
          )}

          <div className="flex gap-4 pt-10 sticky bottom-4 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl z-20">
            <button 
              type="button" 
              onClick={prevStep} 
              className="flex-1 py-6 bg-gray-200 text-gray-700 rounded-2xl text-2xl font-black hover:bg-gray-300 transition-all active:scale-95"
            >
              {currentStep === Step.CHURCH_INFO ? '처음으로' : '이전 단계'}
            </button>
            <button 
              type="submit" 
              className="flex-[2] py-6 bg-[#228B22] text-white rounded-2xl text-2xl font-black shadow-xl hover:bg-green-700 transition-all active:scale-95 border-b-8 border-green-800"
            >
              {currentStep === Step.SUBMISSION ? '특판 신청 완료 (메일발송)' : '다음으로'}
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
    className={`p-10 rounded-3xl shadow-lg text-center transition-all hover:scale-105 active:scale-95 group border-2 ${isHighlight ? 'bg-white border-[#228B22]' : 'bg-white border-transparent'}`}
  >
    <span className="text-gray-400 font-bold text-lg mb-2 block">{title}</span>
    <h4 className="text-3xl font-black mb-4 group-hover:text-[#228B22]">{name}</h4>
    <div className={`text-2xl font-black ${isHighlight ? 'text-[#228B22]' : 'text-gray-700'}`}>{tel}</div>
    <p className="text-sm text-gray-400 mt-4 font-bold italic">번호 터치 시 전화연결</p>
  </a>
);

const InputGroup: React.FC<{label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string}> = ({label, value, onChange, type="text", placeholder}) => (
  <div className="flex flex-col gap-3">
    <label className="text-2xl font-black text-gray-800">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full p-6 border-2 border-gray-200 rounded-2xl text-2xl font-bold focus:border-[#228B22] focus:ring-4 focus:ring-green-100 outline-none transition-all shadow-sm"
      placeholder={placeholder}
      required
    />
  </div>
);

export default App;