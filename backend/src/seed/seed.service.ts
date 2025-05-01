/* eslint-disable prettier/prettier */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { Group } from '../group/entities/group.entity';
import { GroupMembership } from '../group/entities/group-membership.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { ExpenseSplit } from '../expenses/entities/expense-split.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Subscription } from '../subscription/entities/subscription.entity';

// Importa los seeds de datos
import { usersSeed } from './data/users.seed';
import { groupsSeed } from './data/groups.seed';
import { groupMembershipsSeed } from './data/group-membership.seed';
import { expensesSeed } from './data/expenses.seed';
import { expenseSplitsSeed } from './data/expense-splits.seed';
import { paymentsSeed } from './data/payments.seed';
import { subscriptionsSeed } from './data/subscription.seed';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(GroupMembership)
    private membershipRepo: Repository<GroupMembership>,
    @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
    @InjectRepository(ExpenseSplit) private splitRepo: Repository<ExpenseSplit>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.ENABLE_SEED !== 'true') {
      console.log('[SeedService] Precarga deshabilitada por configuración.');
      return;
    }
    console.log('[SeedService] Ejecutando onModuleInit...');
    const userCount = await this.userRepo.count();
    if (userCount > 0) {
      console.log('[SeedService] Datos ya cargados. Ignorando precarga.');
      return;
    }

    console.log('[SeedService] Precargando base de datos...');

    // 1. Usuarios
    const usersWithHashedPasswords = await Promise.all(
      usersSeed.map(async (user) => ({
        ...user,
        password: await this.hashPassword(user.password),
      })),
    );

    const users = await this.userRepo.save(usersWithHashedPasswords);
    console.log('[SeedService] Usuarios cargados con contraseñas hasheadas.');

    // 2. Grupos
    const savedGroups: Group[] = []; // Array para guardar los grupos creados
    for (const groupSeed of groupsSeed) {
      const createdByUser = users.find(
        (u) => u.email === groupSeed.created_by.email,
      );
      if (!createdByUser) {
        throw new Error(
          `Usuario no encontrado para el grupo: ${groupSeed.name}`,
        );
      }
      const newGroup = this.groupRepo.create({
        ...groupSeed,
        created_by: createdByUser,
      });
      const savedGroup = await this.groupRepo.save(newGroup); // Guardar y obtener el grupo guardado
      savedGroups.push(savedGroup); // Agregar al array
    }
    console.log('[SeedService] Grupos cargados.');

    // 3. Membresías
    const savedMemberships: GroupMembership[] = [];
    for (const membershipSeed of groupMembershipsSeed) {
      const user = users.find((u) => u.email === membershipSeed.user.email);
      const group = savedGroups.find(
        (g) => g.name === membershipSeed.group.name,
      ); // Buscar en los grupos guardados
      if (!user) {
        throw new Error(`Usuario no encontrado para la membresía`);
      }
      if (!group) {
        throw new Error(`Grupo no encontrado para la membresía`);
      }
      const newMembership = this.membershipRepo.create({
        ...membershipSeed,
        user: user,
        group: group,
      });
      const savedMembership = await this.membershipRepo.save(newMembership);
      savedMemberships.push(savedMembership);
    }
    console.log('[SeedService] Membresías cargadas.');

    // 4. Gastos
    const savedExpenses: Expense[] = [];
    for (const expenseSeed of expensesSeed) {
      const group = savedGroups.find((g) => g.name === expenseSeed.group.name);
      const paidBy = users.find((u) => u.email === expenseSeed.paid_by.email);
      if (!group) {
        throw new Error(
          `Grupo no encontrado para el gasto: ${expenseSeed.description}`,
        );
      }
      if (!paidBy) {
        throw new Error(
          `Usuario pagador no encontrado para el gasto: ${expenseSeed.description}`,
        );
      }
      const newExpense = this.expenseRepo.create({
        ...expenseSeed,
        group: group,
        paid_by: paidBy,
      });
      const savedExpense = await this.expenseRepo.save(newExpense);
      savedExpenses.push(savedExpense);
    }
    console.log('[SeedService] Gastos cargados.');

    // 5. Divisiones
    for (const splitSeed of expenseSplitsSeed) {
      const expense = savedExpenses.find(
        (e) => e.description === splitSeed.expense.description,
      );
      const user = users.find((u) => u.email === splitSeed.user.email);
      if (!expense) {
        throw new Error(`Gasto no encontrado para la división`);
      }
      if (!user) {
        throw new Error(`Usuario no encontrado para la división`);
      }
      const newSplit = this.splitRepo.create({
        ...splitSeed,
        expense: expense,
        user: user,
      });
      await this.splitRepo.save(newSplit);
    }
    console.log('[SeedService] Divisiones cargadas.');

    // 6. Pagos
    const savedPayments: Payment[] = [];
    for (const paymentSeed of paymentsSeed) {
      const user = await this.userRepo.findOne({ where: { email: paymentSeed.user.email } });
      if (!user) {
        throw new Error(`Usuario no encontrado para el pago con email: ${paymentSeed.user.email}`);
      }
      const newPayment = this.paymentRepo.create({
        amount: paymentSeed.amount,
        status: paymentSeed.status,
        payment_date: paymentSeed.payment_date,
        user: user, // aseguramos que sea una entidad User real
      } as Partial<Payment>); // ✅ Forzamos el tipo para evitar errores de sobrecarga
    
      const savedPayment = await this.paymentRepo.save(newPayment);
      savedPayments.push(savedPayment);
    }
    console.log('[SeedService] Pagos cargados.');

    // 7. Subscripciones
    for (let i = 0; i < subscriptionsSeed.length; i++) {
      const subscriptionSeed = subscriptionsSeed[i];
      const user = users.find((u) => u.email === subscriptionSeed.user.email);
      if (!user) {
        throw new Error(`Usuario no encontrado para la subscripción`);
      }

      const linkedPayment = savedPayments[i] ?? null; // Relación opcional 1 a 1
      const newSubscription = this.subscriptionRepo.create({
        status: subscriptionSeed.status,
        started_at: subscriptionSeed.started_at,
        ends_at: subscriptionSeed.ends_at,
        active: subscriptionSeed.status === 'active',
        user: user, // Asigna la instancia de User
        payment: linkedPayment, // Asigna la instancia de Payment (o null)
      }as Partial<Subscription>);

      await this.subscriptionRepo.save(newSubscription);
    }
    console.log('[SeedService] Subscripciones cargadas.');

    console.log('[SeedService] Datos precargados correctamente.');
  }
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}