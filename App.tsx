
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
    // 구글 드라이브 공유 링크로 연결
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
      <div className="min-h-screen bg-white">
        <section className="relative py-20 flex flex-col items-center justify-center overflow-hidden bg-forest-green text-white">
          <div className="absolute inset-0 opacity-10">
             <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-5xl w-full">
            <div className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full text-2xl font-black mb-6 shadow-xl animate-pulse">
               2026년 한정 고금리 대환 프로젝트
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">
              농협 교회대출 특판 안내
            </h1>
            <p className="text-2xl md:text-4xl font-bold mb-10 text-yellow-300 drop-shadow-md">
              "연 4.30%대 저금리로 지금 바로 갈아타십시오!"
            </p>
            
            <div className="bg-white rounded-3xl p-10 mb-14 shadow-2xl text-gray-800 border-4 border-yellow-400">
              <h3 className="text-3xl font-black border-b-4 border-forest-green pb-4 mb-8 forest-green text-center font-serif">🚀 특별 우대 혜택</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                <div className="flex flex-col items-center p-6 bg-green-50 rounded-2xl border-2 border-green-100">
                  <span className="text-xl font-bold text-gray-500 mb-2">특별 우대 금리</span>
                  <span className="text-5xl font-black text-red-600 italic">연 4.30% ~</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-green-50 rounded-2xl border-2 border-green-100">
                  <span className="text-xl font-bold text-gray-500 mb-2">특판 총 한도</span>
                  <span className="text-5xl font-black text-forest-green">500억 원</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-gray-700">대상: 수도권(서울·경기·인천) 소재 교회 신규 거래처</p>
                <p className="text-xl text-red-600 font-black mt-3 border-t-2 border-dashed pt-3 italic">
                  (기존 서울축산농협 거래처는 금차 특판에서 제외입니다)
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button 
                onClick={nextStep}
                className="px-16 py-8 bg-yellow-400 text-black text-3xl font-black rounded-full shadow-2xl hover:bg-yellow-300 transition-all transform hover:-translate-y-2 active:scale-95 border-b-8 border-yellow-600"
              >
                온라인 상담 신청하기
              </button>
              <button 
                onClick={handleDownloadForm}
                className="px-10 py-8 bg-black text-yellow-400 text-3xl font-black rounded-full shadow-xl hover:bg-gray-800 transition-all border-4 border-yellow-400 flex items-center justify-center gap-2"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                양식 다운로드
              </button>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black mb-10 forest-green italic">대한민국 최대 규모, 서울축산농협</h2>
            <div className="space-y-6 text-2xl text-gray-700 leading-relaxed font-medium">
              <p>서울축산농협은 서울지역 전체에 <span className="font-bold forest-green underline">28개의 금융점포</span>를 보유한 지역농협으로서 대한민국 최대 규모를 자랑합니다.</p>
              <p>최초로 <span className="font-bold text-red-600">미션대출</span>을 개발하여 수십년간 교회의 든든한 금융파트너로 함께 하여왔습니다.</p>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-16 forest-green drop-shadow-sm">📞 대환 대출 전담 상담 창구 (상계역지점)</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <a href="tel:02-2181-5228" className="bg-white p-10 rounded-3xl shadow-lg border-t-8 border-gray-400 text-center transition-all hover:bg-gray-50 active:scale-95 group">
                <span className="text-gray-500 text-xl font-bold">과장</span>
                <h4 className="text-3xl font-black mb-4">정창운</h4>
                <div className="text-gray-700 font-black text-2xl group-hover:underline">02-2181-5228</div>
                <p className="text-sm text-gray-400 mt-2 font-bold italic">번호클릭시 자동연결</p>
              </a>
              <a href="tel:02-2181-5221" className="bg-white p-10 rounded-3xl shadow-lg border-t-8 border-blue-500 text-center transition-all hover:bg-blue-50 active:scale-95 group">
                <span className="text-gray-500 text-xl font-bold">부지점장</span>
                <h4 className="text-3xl font-black mb-4">장정숙</h4>
                <div className="text-blue-600 font-black text-2xl group-hover:underline">02-2181-5221</div>
                <p className="text-sm text-gray-400 mt-2 font-bold italic">번호클릭시 자동연결</p>
              </a>
              <a href="tel:010-7399-5380" className="bg-white p-10 rounded-3xl shadow-lg border-t-8 border-forest-green text-center transition-all hover:bg-green-50 active:scale-95 group">
                <span className="text-gray-500 text-xl font-bold">지점장</span>
                <h4 className="text-3xl font-black mb-4">김대윤</h4>
                <div className="text-forest-green font-black text-2xl group-hover:underline">010-7399-5380</div>
                <p className="text-sm text-gray-400 mt-2 font-bold italic">번호클릭시 자동연결</p>
              </a>
            </div>
            
            <div className="mt-16 bg-white p-12 rounded-3xl shadow-md border-2 border-gray-200 text-center">
              <h3 className="text-3xl font-black mb-6 forest-green">📠 온라인 및 팩스 상담 신청 안내</h3>
              <p className="text-2xl font-bold text-gray-700 mb-4">사무실 팩스 번호: <a href="tel:02-3392-3916" className="underline forest-green font-black">02-3392-3916</a></p>
              <p className="text-xl text-gray-500 leading-relaxed font-bold">본 사이트를 통한 [온라인 접수] 또는 [상담신청서 팩스송부] 모두 가능합니다.</p>
              <p className="text-lg text-gray-400 mt-2 font-medium">상단 '양식 다운로드' 후 작성하여 팩스로 보내주셔도 신속히 상담해 드립니다.</p>
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
    <div className="min-h-screen pb-20">
      <header className="relative bg-forest-green py-12 px-4 text-center overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-10 flex justify-center items-center">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10">
          <div className="flex justify-center mb-4 text-6xl text-white">✝</div>
          <h1 className="text-white text-4xl font-black mb-2 tracking-tight">2026 교회대출 특판 신청 시스템</h1>
          <p className="text-white text-xlarge opacity-95 font-bold">서울축산농협 상계역지점 대환 대출 전용</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100">
        <div className="flex justify-between mb-12 border-b-2 border-gray-100 pb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black mb-2 transition-colors ${currentStep >= s ? 'bg-forest-green text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
              <span className={`text-xl font-bold ${currentStep >= s ? 'text-forest-green' : 'text-gray-400'}`}>Step {s}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {currentStep === Step.CHURCH_INFO && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black border-b-4 border-forest-green pb-3 mb-8 font-serif">Step 1: 교회 기본 정보</h2>
              <InputGroup label="교회명" value={formData.churchName} onChange={(v) => updateFormData({ churchName: v })} placeholder="교회 이름을 입력하세요" />
              <InputGroup label="소속 교단" value={formData.denomination} onChange={(v) => updateFormData({ denomination: v })} placeholder="예: 대한예수교장로회" />
              <InputGroup label="소재지" value={formData.location} onChange={(v) => updateFormData({ location: v })} placeholder="교회 주소를 입력해 주세요" />
              <InputGroup label="출석 성년 교인수 (명)" value={formData.memberCount} onChange={(v) => updateFormData({ memberCount: v })} type="number" placeholder="장년 기준" />
            </div>
          )}

          {currentStep === Step.LOAN_STATUS && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black border-b-4 border-forest-green pb-3 mb-8 font-serif">Step 2: 대출 및 재정 현황</h2>
              <InputGroup label="기존 대출금액 (원)" value={formData.currentLoanAmount} onChange={(v) => updateFormData({ currentLoanAmount: v })} type="number" placeholder="현재 대출 잔액" />
              <InputGroup label="금융기관명 (현재 거래처)" value={formData.bankName} onChange={(v) => updateFormData({ bankName: v })} placeholder="거래 중인 은행명" />
              <InputGroup label="현재 적용 금리 (%)" value={formData.currentInterestRate} onChange={(v) => updateFormData({ currentInterestRate: v })} placeholder="예: 6.5" />
            </div>
          )}

          {currentStep === Step.COLLATERAL && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black border-b-4 border-forest-green pb-3 mb-8 font-serif">Step 3: 담보물 소재지 (지번 목록)</h2>
              <div className="space-y-5">
                {formData.collaterals.map((collateral, index) => (
                  <div key={collateral.id} className="flex gap-4 items-center">
                    <span className="text-2xl font-black text-forest-green w-24 text-center">{index + 1}번</span>
                    <input 
                      type="text" 
                      className="flex-1 p-6 border-2 border-gray-200 rounded-2xl text-2xl font-bold focus:border-forest-green focus:outline-none transition-all shadow-sm"
                      placeholder="담보물 소재지(지번) 및 상세 주소"
                      value={collateral.description}
                      onChange={(e) => handleCollateralChange(collateral.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                onClick={handleAddCollateral}
                className="w-full mt-8 py-8 border-4 border-dashed border-forest-green rounded-3xl text-forest-green font-black text-3xl hover:bg-green-50 active:scale-95 transition-all shadow-md"
              >
                + 담보물 추가 입력창 생성
              </button>
            </div>
          )}

          {currentStep === Step.ATTACHMENT && (
            <div className="space-y-10">
              <h2 className="text-3xl font-black border-b-4 border-forest-green pb-3 mb-8 font-serif">Step 4: 교회 담당자 정보</h2>
              <div className="bg-gray-50 p-10 rounded-3xl space-y-8 border-2 border-gray-200 shadow-inner">
                <InputGroup label="담당자 성명" value={formData.managerName} onChange={(v) => updateFormData({ managerName: v })} placeholder="성함을 입력하세요" />
                <InputGroup label="직분" value={formData.position} onChange={(v) => updateFormData({ position: v })} placeholder="예: 담임목사, 장로, 회계" />
                <InputGroup label="전화번호" value={formData.phoneNumber} onChange={(v) => updateFormData({ phoneNumber: v })} placeholder="010-0000-0000" />
                <InputGroup label="이메일" value={formData.email} onChange={(v) => updateFormData({ email: v })} type="email" placeholder="이메일 주소" />
              </div>
            </div>
          )}

          {currentStep === Step.SUBMISSION && (
            <div className="space-y-10">
              <h2 className="text-3xl font-black border-b-4 border-forest-green pb-3 mb-8 font-serif">Step 5: 약관 동의 및 최종 신청</h2>
              <div className="p-10 bg-ivory border-4 border-gray-100 rounded-3xl text-2xl leading-relaxed text-gray-700 shadow-inner font-medium">
                <h4 className="font-black mb-6 text-3xl border-b pb-4">[개인정보 수집 및 이용 동의]</h4>
                <p>본 신청서에 기재된 정보는 교회대출 상담 및 한도 조회 목적으로만 사용되며, 관련 법령에 따라 안전하게 보호됩니다.</p>
              </div>
              <div className="space-y-10 bg-green-50 p-12 rounded-3xl border-4 border-forest-green shadow-2xl">
                <div className="flex items-center gap-6">
                  <input type="checkbox" id="agreement" className="w-12 h-12 accent-forest-green cursor-pointer" checked={formData.agreement} onChange={(e) => updateFormData({ agreement: e.target.checked })} />
                  <label htmlFor="agreement" className="text-3xl font-black cursor-pointer text-gray-900">상기 약관에 모두 동의합니다.</label>
                </div>
                <InputGroup label="신청인 성명 (전자 서명 대용)" value={formData.applicantName} onChange={(v) => updateFormData({ applicantName: v })} placeholder="본인 성함을 입력하세요" />
              </div>
            </div>
          )}

          <div className="flex gap-6 pt-12 sticky bottom-0 bg-white/95 backdrop-blur-md py-6 shadow-[0_-15px_40px_rgba(0,0,0,0.1)]">
            <button type="button" onClick={prevStep} className="flex-1 py-7 bg-gray-200 text-gray-700 rounded-3xl text-3xl font-black hover:bg-gray-300 transition-all">
              {currentStep === Step.CHURCH_INFO ? '처음으로' : '이전 단계'}
            </button>
            <button type="submit" className="flex-[2] py-7 bg-forest-green text-white rounded-3xl text-3xl font-black border-b-8 border-green-800 hover:bg-green-700 active:scale-95 transition-all">
              {currentStep === Step.SUBMISSION ? '특판 신청 완료 (메일발송)' : '다음 단계로'}
            </button>
          </div>
        </form>
      </main>

      <footer className="mt-20 text-center text-gray-500 pb-20 px-6">
        <p className="text-2xl font-bold">서울축산농협 상계역지점</p>
        <p className="mt-6 text-xl font-medium">상담: <a href="tel:02-2181-5228" className="forest-green underline font-black">02-2181-5228</a></p>
        <p className="text-lg mt-2 text-gray-400 font-bold italic">사무실 팩스: <a href="tel:02-3392-3916" className="underline forest-green">02-3392-3916</a></p>
      </footer>
    </div>
  );
};

const InputGroup: React.FC<{label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string}> = ({label, value, onChange, type="text", placeholder}) => (
  <div className="flex flex-col gap-4">
    <label className="text-3xl font-black text-gray-800">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-8 border-3 border-gray-200 rounded-3xl text-3xl font-bold focus:border-forest-green focus:outline-none shadow-sm focus:ring-4 focus:ring-green-100 transition-all" placeholder={placeholder} />
  </div>
);

export default App;
