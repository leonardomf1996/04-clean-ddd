import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let fakeQuestionsRepository: InMemoryQuestionsRepository
let fakeQuestionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionUseCase

describe('Create question', () => {
  beforeEach(() => {
    fakeQuestionsAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    fakeQuestionsRepository = new InMemoryQuestionsRepository(
      fakeQuestionsAttachmentsRepository,
    )

    sut = new CreateQuestionUseCase(fakeQuestionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: 'valid-id',
      title: 'valid-title',
      content: 'valid-content',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRigth()).toBe(true)
    expect(fakeQuestionsRepository.items[0]).toEqual(result.value?.question)
    expect(
      fakeQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(fakeQuestionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
