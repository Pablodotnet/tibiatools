import { describe, it, expect } from 'vitest';
import { parseHuntSession } from '../huntSessionParser';

describe('parseHuntSession', () => {
  it('parses a basic solo hunt', () => {
    const result = parseHuntSession(`Session: 2024-01-15 14:30 until 16:45 (2:15)
Vocation: Elite Knight
Level: 350
Damage: 1,500,000
Healing: 800,000
Damage Received: 200,000
Loot: 450,000
Supplies: 120,000
Balance: 330,000
XP Gain: 2,500,000
XP/h: 1,111,111`);
    expect(result.isParty).toBe(false);
    expect(result.vocation).toBe('Elite Knight');
    expect(result.level).toBe(350);
    expect(result.damage).toBe(1500000);
    expect(result.healing).toBe(800000);
    expect(result.damageReceived).toBe(200000);
    expect(result.loot).toBe(450000);
    expect(result.supplies).toBe(120000);
    expect(result.balance).toBe(330000);
    expect(result.xpGain).toBe(2500000);
    expect(result.xpPerHour).toBe(1111111);
    expect(result.durationMinutes).toBe(135);
    expect(result.sessionDate).toMatch(/2024-01-15/);
  });

  it('parses a party hunt', () => {
    const text = `Party Hunt: 2024-01-20 20:00! (1:30)
Vocation: Royal Paladin
Level: 400
Damage: 2,000,000
Healing: 500,000
Damage Received: 150,000
Loot: 600,000
Supplies: 200,000
Balance: 400,000
XP Gain: 3,000,000
XP/h: 2,000,000

Player: SirRob  (Level 350)
Damage: 1,200,000
Healing: 300,000
Loot: 350,000
Supplies: 100,000
Balance: 250,000
XP: 1,800,000
XP/h: 1,200,000

Player: MagePro  (Level 450)
Damage: 800,000
Healing: 200,000
Loot: 250,000
Supplies: 100,000
Balance: 150,000
XP: 1,200,000
XP/h: 800,000`;
    const result = parseHuntSession(text);
    expect(result.isParty).toBe(true);
    expect(result.level).toBe(400);
    expect(result.vocation).toBe('Royal Paladin');
    expect(result.players).toHaveLength(2);
    expect(result.players![0].name).toBe('SirRob');
    expect(result.players![0].level).toBe(350);
    expect(result.players![0].damage).toBe(1200000);
    expect(result.players![0].balance).toBe(250000);
    expect(result.players![1].name).toBe('MagePro');
    expect(result.players![1].level).toBe(450);
  });

  it('parses duration from h/min format', () => {
    const result = parseHuntSession('Session: until 22:30 (Duration: 1h 15min)');
    expect(result.durationMinutes).toBe(75);
  });

  it('parses duration from colon format with seconds', () => {
    const result = parseHuntSession('Session: until 22:30 (1:15:30)');
    expect(result.durationMinutes).toBe(76);
  });

  it('returns undefined for missing duration', () => {
    const result = parseHuntSession('Loot: 100,000');
    expect(result.durationMinutes).toBeUndefined();
  });

  it('parses numbers with gp suffix', () => {
    const result = parseHuntSession(`Loot: 500000 gp
Supplies: 100000 gp
Balance: 400000 gp`);
    expect(result.loot).toBe(500000);
    expect(result.supplies).toBe(100000);
    expect(result.balance).toBe(400000);
  });

  it('parses negative balance', () => {
    const result = parseHuntSession('Balance: -50,000');
    expect(result.balance).toBe(-50000);
  });

  it('parses killed monsters', () => {
    const result = parseHuntSession(`Session: 2024-01-15
Loot: 450,000
Killed Monsters:
Dragon: 15
Dragon Lord: 5
Demon: 2`);
    expect(result.killedMonsters).toHaveLength(3);
    expect(result.killedMonsters![0]).toEqual({ name: 'Dragon', count: 15 });
    expect(result.killedMonsters![1]).toEqual({ name: 'Dragon Lord', count: 5 });
    expect(result.killedMonsters![2]).toEqual({ name: 'Demon', count: 2 });
  });

  it('parses loot items with quantities and values', () => {
    const result = parseHuntSession(`Session: 2024-01-15
Loot:
Dragon Hammer x 1 (12,000 gp)
Gold Coin x 100 (100 gp)
Dragon Lord Leather x 3 (45,000 gp)

Supplies:
Health Potion x 10 (5,000 gp)
Mana Potion x 5 (2,500 gp)`);
    expect(result.lootItems).toHaveLength(3);
    expect(result.lootItems![0]).toMatchObject({ name: 'Dragon Hammer', count: 1 });
    expect(result.lootItems![0].value).toBe(12000);
    expect(result.lootItems![1].name).toBe('Gold Coin');
    expect(result.supplyItems).toHaveLength(2);
    expect(result.supplyItems![0].name).toBe('Health Potion');
  });

  it('returns no players for solo hunt', () => {
    const result = parseHuntSession('Loot: 100,000');
    expect(result.players).toBeUndefined();
  });

  it('handles empty text', () => {
    const result = parseHuntSession('');
    expect(result.durationMinutes).toBeUndefined();
    expect(result.loot).toBeUndefined();
    expect(result.players).toBeUndefined();
    expect(result.isParty).toBe(false);
  });

  it('handles raw analyzer format with "gp" on values', () => {
    const text = `Session: 2024-06-10 19:27:05 until 21:37:32
Loot: 345,981 gp
Supplies: 88,552 gp
Balance: 257,429 gp
XP Gain: 3,013,688 gp
XP/h: 1,507,019 gp`;
    const result = parseHuntSession(text);
    expect(result.loot).toBe(345981);
    expect(result.supplies).toBe(88552);
    expect(result.balance).toBe(257429);
    expect(result.xpGain).toBe(3013688);
    expect(result.xpPerHour).toBe(1507019);
  });

  it('parses party with per-player vocation', () => {
    const text = `Party Hunt: 2024-07-01 18:00! (2:00)
Player: TankKnight (Level 400)
Vocation: Elite Knight
Damage: 1,000,000
Loot: 400,000

Player: HealerDruid (Level 380)
Vocation: Elder Druid
Damage: 500,000
Loot: 300,000`;
    const result = parseHuntSession(text);
    expect(result.isParty).toBe(true);
    expect(result.players).toHaveLength(2);
    expect(result.players![0].vocation).toBe('Elite Knight');
    expect(result.players![1].vocation).toBe('Elder Druid');
  });

  it('parses level with commas', () => {
    const result = parseHuntSession('Level: 1,500\nLoot: 100,000');
    expect(result.level).toBe(1500);
  });
});
