
import React, { useState } from 'react';
import { ChurchFormData, Step } from './types';
import { v4 as uuidv4 } from 'uuid';

const FOREST_GREEN = '#228B22';

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
      <div className="flex flex-col min-h-screen bg-white">
        <section className="relative py-20 flex flex-col items-center justify-center bg-[#228B22] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <div className="relative z-10 text-center px-4 max-w-5xl w-full">
            <div className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-full text-xl font-black mb-6 shadow-lg animate-pulse">
               2026년 한정 고금리 대환 프로젝트
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              농협 교회대출 특판 안내
            </h1>
            <p className="text-xl md:text-3xl font-bold mb-10 text-yellow-300">
              "연 4.30%대 저금리로 지금 바로 갈아타십시오!"
            </p>
            
            <div className="bg-white rounded-3xl p-8 mb-12 shadow-2xl text-gray-800 border-4 border-yellow-400">
              <h3 className="text-3xl font-black mb-8 text-[#228B22]">🚀 특별 우대 혜택</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-center p-6 bg-green-50 rounded-2xl border border-green-200">
                  <span className="text-lg font-bold text-gray-500 mb-1">특별 우대 금리</span>
                  <span className="text-4xl font-black text-red-600 italic">연 4.30% ~</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-green-50 rounded-2xl border border-green-200">
                  <span className="text-lg font-bold text-gray-500 mb-1">특판 총 한도</span>
                  <span className="text-4xl font-black text-[#228B22]">500억 원</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-gray-700">대상: 수도권(서울·경기·인천) 소재 교회 신규 거래처</p>
                <p className="text-lg text-red-600 font-black mt-2 italic">
                  (기존 서울축산농협 거래처는 제외입니다)
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={nextStep}
                className="px-12 py-6 bg-yellow-400 text-black text-2xl font-black rounded-full shadow-xl hover:bg-yellow-300 transition-all border-b-4 border-yellow-600"
              >
                온라인 상담 신청하기
              </button>
              <button 
                onClick={handleDownloadForm}
                className="px-10 py-6 bg-black text-yellow-400 text-2xl font-black rounded-full shadow-xl hover:bg-gray-800 transition-all border-2 border-yellow-400 flex items-center justify-center gap-2"
              >
                📥 양식 다운로드
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-8 text-[#228B22]">대한민국 최대 규모, 서울축산농협</h2>
            <div className="space-y-4 text-xl text-gray-700 leading-relaxed">
              <p>서울축산농협은 서울지역 전체에 <span className="font-bold text-[#228B22]">28개의 금융점포</span>를 보유한</p>
              <p>대한민국 최대 규모의 지역농협입니다.</p>
              <p>수십년간 교회의 든든한 금융파트너로 함께 하여왔습니다.</p>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black text-center mb-12 text-[#228B22]">📞 대환 대출 전담 상담 창구</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <ConsultCard title="과장" name="정창운" tel="02-2181-5228" color="gray-400" />
              <ConsultCard title="부지점장" name="장정숙" tel="02-2181-5221" color="blue-500" />
              <ConsultCard title="지점장" name="김대윤" tel="010-7399-5380" color-[#228B22] />
            </div>
          </div>
        </section>

        <footer className="bg-white py-12 text-center text-gray-400 border-t border-gray-100">
           <p className="font-bold">© 2026 서울축산농협 상계역지점</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20">
      <header className="bg-[#228B22] py-10 px-4 text-center text-white shadow-lg">
        <div className="text-5xl mb-3">✝</div>
        <h1 className="text-3xl font-black mb-1">2026 교회대출 특판 신청</h1>
        <p className="text-lg opacity-90">서울축산농협 상계역지점 대환 대출 전용</p>
      </header>

      <main className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
        <div className="flex justify-between mb-10 overflow-x-auto py-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex flex-col items-center min-w-[50px] flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black mb-1 ${currentStep >= s ? 'bg-[#228B22] text-white' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
              <span className={`text-xs font-bold ${currentStep >= s ? 'text-[#228B22]' : 'text-gray-400'}`}>Step {s}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {currentStep === Step.CHURCH_INFO && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black border-b-2 border-[#228B22] pb-2 mb-6">1. 교회 기본 정보</h2>
              <InputGroup label="교회명" value={formData.churchName} onChange={(v) => updateFormData({ churchName: v })} />
              <InputGroup label="소속 교단" value={formData.denomination} onChange={(v) => updateFormData({ denomination: v })} />
              <InputGroup label="소재지" value={formData.location} onChange={(v) => updateFormData({ location: v })} />
              <InputGroup label="출석 성년 교인수 (명)" value={formData.memberCount} onChange={(v) => updateFormData({ memberCount: v })} type="number" />
            </div>
          )}

          {currentStep === Step.LOAN_STATUS && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black border-b-2 border-[#228B22] pb-2 mb-6">2. 대출 및 재정 현황</h2>
              <InputGroup label="기존 대출금액 (원)" value={formData.currentLoanAmount} onChange={(v) => updateFormData({ currentLoanAmount: v })} type="number" />
              <InputGroup label="금융기관명" value={formData.bankName} onChange={(v) => updateFormData({ bankName: v })} />
              <InputGroup label="현재 적용 금리 (%)" value={formData.currentInterestRate} onChange={(v) => updateFormData({ currentInterestRate: v })} />
            </div>
          )}

          {currentStep === Step.COLLATERAL && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black border-b-2 border-[#228B22] pb-2 mb-6">3. 담보물 소재지</h2>
              {formData.collaterals.map((collateral, index) => (
                <div key={collateral.id} className="flex gap-2">
                  <span className="font-black text-[#228B22] py-4">{index + 1}.</span>
                  <input 
                    type="text" 
                    className="flex-1 p-4 border rounded-xl font-bold focus:ring-2 focus:ring-[#228B22] outline-none"
                    placeholder="주소 입력"
                    value={collateral.description}
                    onChange={(e) => handleCollateralChange(collateral.id, e.target.value)}
                  />
                </div>
              ))}
              <button type="button" onClick={handleAddCollateral} className="w-full py-4 border-2 border-dashed border-[#228B22] rounded-xl text-[#228B22] font-bold">
                + 입력창 추가
              </button>
            </div>
          )}

          {currentStep === Step.ATTACHMENT && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black border-b-2 border-[#228B22] pb-2 mb-6">4. 담당자 정보</h2>
              <InputGroup label="담당자 성명" value={formData.managerName} onChange={(v) => updateFormData({ managerName: v })} />
              <InputGroup label="직분" value={formData.position} onChange={(v) => updateFormData({ position: v })} />
              <InputGroup label="전화번호" value={formData.phoneNumber} onChange={(v) => updateFormData({ phoneNumber: v })} />
              <InputGroup label="이메일" value={formData.email} onChange={(v) => updateFormData({ email: v })} type="email" />
            </div>
          )}

          {currentStep === Step.SUBMISSION && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black border-b-2 border-[#228B22] pb-2 mb-6">5. 최종 제출</h2>
              <div className="p-5 bg-gray-50 border rounded-xl text-sm text-gray-600">
                개인정보는 대출 상담 목적으로만 안전하게 사용됩니다.
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="agree" className="w-6 h-6" checked={formData.agreement} onChange={(e) => updateFormData({ agreement: e.target.checked })} />
                <label htmlFor="agree" className="font-bold cursor-pointer">상기 내용에 동의합니다.</label>
              </div>
              <InputGroup label="신청인 성명" value={formData.applicantName} onChange={(v) => updateFormData({ applicantName: v })} />
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <button type="button" onClick={prevStep} className="flex-1 py-4 bg-gray-200 rounded-xl font-bold">
              {currentStep === Step.CHURCH_INFO ? '메인으로' : '이전'}
            </button>
            <button type="submit" className="flex-[2] py-4 bg-[#228B22] text-white rounded-xl font-black shadow-lg">
              {currentStep === Step.SUBMISSION ? '신청 완료' : '다음 단계'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

const ConsultCard: React.FC<{title: string, name: string, tel: string, color: string}> = ({title, name, tel}) => (
  <a href={`tel:${tel}`} className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-[#228B22] text-center hover:bg-green-50 transition-colors block">
    <span className="text-gray-400 font-bold">{title}</span>
    <h4 className="text-2xl font-black mb-2">{name}</h4>
    <div className="text-[#228B22] font-black">{tel}</div>
  </a>
);

const InputGroup: React.FC<{label: string, value: string, onChange: (v: string) => void, type?: string}> = ({label, value, onChange, type="text"}) => (
  <div className="flex flex-col gap-1">
    <label className="font-black text-gray-700">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="p-4 border rounded-xl font-bold focus:ring-2 focus:ring-[#228B22] outline-none" />
  </div>
);

export default App;