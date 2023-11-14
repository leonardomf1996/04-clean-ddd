import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }

  async findById(id: string): Promise<Notification | null> {
    const idUnique = new UniqueEntityID(id)
    const notification = this.items.find((item) => item.getId() === idUnique)

    if (!notification) return null

    return notification
  }

  async save(notification: Notification): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.getId() === notification.getId(),
    )

    this.items[itemIndex] = notification
  }
}
