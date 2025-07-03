'use client';

import { Question } from '@/types';
import { parseQAMarkdown } from '@/utils/parser';
import { useState } from 'react';

interface QuestionInputProps {
	onQuestionsParsed: (questions: Question[]) => void;
}

type InputMethod = 'file' | 'paste' | 'manual';

export default function QuestionInput({ onQuestionsParsed }: QuestionInputProps) {
	const [inputMethod, setInputMethod] = useState<InputMethod>('file');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [pastedText, setPastedText] = useState('');
	const [manualQuestions, setManualQuestions] = useState<Array<{ question: string; answer: string }>>([
		{ question: '', answer: '' },
	]);

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (file.type !== 'text/markdown' && !file.name.endsWith('.md')) {
			setError('يرجى رفع ملف .md صحيح');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const content = await file.text();
			const questions = parseQAMarkdown(content);

			if (questions.length === 0) {
				setError('لم يتم العثور على أسئلة في الملف');
				return;
			}

			onQuestionsParsed(questions);
		} catch (err) {
			setError('حدث خطأ في قراءة الملف');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePasteText = () => {
		if (!pastedText.trim()) {
			setError('يرجى لصق النص أولاً');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const questions = parseQAMarkdown(pastedText);

			if (questions.length === 0) {
				setError('لم يتم العثور على أسئلة في النص المُلصق');
				return;
			}

			onQuestionsParsed(questions);
		} catch (err) {
			setError('حدث خطأ في معالجة النص');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleManualSubmit = () => {
		const validQuestions = manualQuestions.filter((q) => q.question.trim() && q.answer.trim());

		if (validQuestions.length === 0) {
			setError('يرجى إدخال سؤال وإجابة واحد على الأقل');
			return;
		}

		const questions: Question[] = validQuestions.map((q, index) => ({
			id: index + 1,
			question: q.question.trim(),
			answer: q.answer.trim(),
		}));

		onQuestionsParsed(questions);
		setError('');
	};

	const addManualQuestion = () => {
		setManualQuestions([...manualQuestions, { question: '', answer: '' }]);
	};

	const removeManualQuestion = (index: number) => {
		if (manualQuestions.length > 1) {
			setManualQuestions(manualQuestions.filter((_, i) => i !== index));
		}
	};

	const updateManualQuestion = (index: number, field: 'question' | 'answer', value: string) => {
		const updated = [...manualQuestions];
		updated[index][field] = value;
		setManualQuestions(updated);
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow-md'>
			<h3 className='text-lg font-semibold mb-4 text-right'>إدخال الأسئلة والأجوبة</h3>

			{/* Instructions */}
			<div className='mb-6 p-4 bg-blue-50 rounded-lg border-r-4 border-blue-400'>
				<h4 className='text-sm font-semibold text-blue-800 mb-2 text-right'>💡 كيفية الاستخدام</h4>
				<div className='text-xs text-blue-700 text-right space-y-1'>
					<div>
						• <strong>رفع ملف:</strong> مثالي للأسئلة الكثيرة (10+ أسئلة)
					</div>
					<div>
						• <strong>لصق نص:</strong> مثالي للنسخ من مصادر أخرى
					</div>
					<div>
						• <strong>إدخال يدوي:</strong> مثالي للأسئلة القليلة (1-5 أسئلة)
					</div>
				</div>
			</div>

			{/* Method Selection */}
			<div className='mb-6'>
				<div className='flex space-x-4 space-x-reverse mb-4'>
					<button
						onClick={() => setInputMethod('file')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							inputMethod === 'file'
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						📄 رفع ملف
					</button>
					<button
						onClick={() => setInputMethod('paste')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							inputMethod === 'paste'
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						📋 لصق نص
					</button>
					<button
						onClick={() => setInputMethod('manual')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							inputMethod === 'manual'
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						✏️ إدخال يدوي
					</button>
				</div>
			</div>

			{/* File Upload Method */}
			{inputMethod === 'file' && (
				<div className='w-full space-y-4'>
					<div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors'>
						<input
							type='file'
							accept='.md,text/markdown'
							onChange={handleFileUpload}
							className='hidden'
							id='file-upload'
							disabled={isLoading}
						/>
						<label htmlFor='file-upload' className='cursor-pointer block'>
							<div className='text-gray-600'>
								{isLoading ? (
									<div className='flex items-center justify-center'>
										<div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
										<span className='mr-2'>جاري المعالجة...</span>
									</div>
								) : (
									<>
										<div className='text-4xl mb-2'>📄</div>
										<div className='text-lg font-medium mb-2'>ارفع ملف qa.md</div>
										<div className='text-sm text-gray-500'>انقر هنا أو اسحب الملف إلى هنا</div>
									</>
								)}
							</div>
						</label>
					</div>

					<div className='bg-gray-50 p-4 rounded-lg'>
						<h4 className='text-sm font-semibold text-gray-700 mb-2 text-right'>📋 تنسيق الملف المطلوب:</h4>
						<div className='text-xs text-gray-600 text-right space-y-2'>
							<div>
								<strong>التنسيق البسيط:</strong>
							</div>
							<pre className='bg-white p-2 rounded border text-xs text-right'>
								{`ما هو الاختبار الذاتي؟
الإجابة: طريقة للتحقق من فهمك للمادة الدراسية

ما هي مميزات الاختبار الذاتي؟
الإجابة: يساعد على تثبيت المعلومات واكتشاف نقاط الضعف`}
							</pre>
							<div>
								<strong>التنسيق المرقم:</strong>
							</div>
							<pre className='bg-white p-2 rounded border text-xs text-right'>
								{`1. ما هو التعلم النشط؟
   الإجابة: أسلوب تعلم يعتمد على المشاركة الفعالة

2. ما هي استراتيجيات الدراسة؟
   الإجابة: التكرار المتباعد والاختبار الذاتي`}
							</pre>
						</div>
					</div>
				</div>
			)}

			{/* Paste Text Method */}
			{inputMethod === 'paste' && (
				<div className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2 text-right'>لصق النص هنا:</label>
						<textarea
							value={pastedText}
							onChange={(e) => setPastedText(e.target.value)}
							placeholder='ما هو الاختبار الذاتي؟
الإجابة: طريقة للتحقق من فهمك للمادة الدراسية

ما هي مميزات الاختبار الذاتي؟
الإجابة: يساعد على تثبيت المعلومات واكتشاف نقاط الضعف'
							className='w-full h-40 border border-gray-300 rounded-lg px-3 py-2 text-right resize-none'
							dir='rtl'
						/>
					</div>

					<div className='bg-green-50 p-4 rounded-lg border-r-4 border-green-400'>
						<h4 className='text-sm font-semibold text-green-800 mb-2 text-right'>💡 نصائح للصق النص:</h4>
						<div className='text-xs text-green-700 text-right space-y-1'>
							<div>• يمكنك نسخ النص من أي مصدر (Word, PDF, موقع إلكتروني)</div>
							<div>• تأكد من أن كل سؤال يتبعه &quot;الإجابة:&quot;</div>
							<div>• يمكن استخدام الترقيم أو بدونه</div>
							<div>• اترك سطر فارغ بين كل سؤال وإجابة</div>
						</div>
					</div>

					<button
						onClick={handlePasteText}
						disabled={isLoading || !pastedText.trim()}
						className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
					>
						{isLoading ? 'جاري المعالجة...' : 'معالجة النص'}
					</button>
				</div>
			)}

			{/* Manual Entry Method */}
			{inputMethod === 'manual' && (
				<div className='space-y-4'>
					<div className='bg-purple-50 p-4 rounded-lg border-r-4 border-purple-400'>
						<h4 className='text-sm font-semibold text-purple-800 mb-2 text-right'>✏️ الإدخال اليدوي:</h4>
						<div className='text-xs text-purple-700 text-right space-y-1'>
							<div>• مثالي للأسئلة القليلة (1-5 أسئلة)</div>
							<div>• يمكنك إضافة أو حذف أسئلة حسب الحاجة</div>
							<div>• كل سؤال وإجابة في حقول منفصلة</div>
							<div>• مناسب للاختبارات السريعة والمراجعات</div>
						</div>
					</div>

					<div className='space-y-3'>
						{manualQuestions.map((question, index) => (
							<div key={index} className='border border-gray-200 rounded-lg p-4'>
								<div className='flex justify-between items-center mb-2'>
									<span className='text-sm font-medium text-gray-700'>السؤال {index + 1}</span>
									{manualQuestions.length > 1 && (
										<button
											onClick={() => removeManualQuestion(index)}
											className='text-red-500 hover:text-red-700 text-sm'
										>
											🗑️ حذف
										</button>
									)}
								</div>
								<input
									type='text'
									value={question.question}
									onChange={(e) => updateManualQuestion(index, 'question', e.target.value)}
									placeholder='أدخل السؤال هنا...'
									className='w-full border border-gray-300 rounded px-3 py-2 text-right mb-2'
									dir='rtl'
								/>
								<textarea
									value={question.answer}
									onChange={(e) => updateManualQuestion(index, 'answer', e.target.value)}
									placeholder='أدخل الإجابة هنا...'
									className='w-full border border-gray-300 rounded px-3 py-2 text-right resize-none'
									rows={2}
									dir='rtl'
								/>
							</div>
						))}
					</div>

					<div className='flex space-x-2 space-x-reverse'>
						<button
							onClick={addManualQuestion}
							className='bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors'
						>
							➕ إضافة سؤال
						</button>
						<button
							onClick={handleManualSubmit}
							disabled={manualQuestions.every((q) => !q.question.trim() || !q.answer.trim())}
							className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
						>
							إنشاء الاختبار
						</button>
					</div>
				</div>
			)}

			{error && (
				<div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-right'>{error}</div>
			)}
		</div>
	);
}
