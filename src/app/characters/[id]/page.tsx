/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { SetStateAction, useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Navbar from '@/components/navbar';
import { useParams } from 'next/navigation';
import { Poppins } from 'next/font/google';
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { IoSearchSharp } from "react-icons/io5";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { FaRegTrashCan } from "react-icons/fa6";
import { TbPencil } from "react-icons/tb";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { GiD4 } from "react-icons/gi";
import { GiPerspectiveDiceSix } from "react-icons/gi";
import { GiDiceEightFacesEight } from "react-icons/gi";
import { GiD10 } from "react-icons/gi";
import { GiD12 } from "react-icons/gi";
import { GiDiceTwentyFacesTwenty } from "react-icons/gi";

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
});

interface Character {
    id: number;
    name: string;
    age: number | null;
    char_class: string;
    char_subclass: string;
    nacionality: string;
    max_health: number;
    current_health: number;
    max_stamina: number;
    current_stamina: number;
    max_mana: number;
    current_mana: number;
    money: number;
    armor_class: number;
    movement: number;
    initiative: number;
}

interface Attribute {
    dicenumber: number;
    id: number | null;
    name: string;
    value: number;
    char_id: number;
}

interface Skill {
    id: number | null;
    name: string;
    value: number;
    parent_attribute: string | null;
    char_id: number;
}

interface Spell {
    id: number;
    name: string;
    description: string;
    cost: number;
    cost_type: string;
    dicenumber: number;
    diceqtd: number;
    char_id: number;
}

interface Ability {
    id: number;
    name: string;
    description: string;
    char_id: number;
}

interface InventoryItem {
    id: number;
    item: string;
    quantity: number;
    weight: number;
    dicenumber: number;
    diceqtd: number;
    char_id: number;
}

interface CharacterData {
    character: Character;
    attributes?: Attribute[];
    skills?: Skill[];
    spells?: Spell[];
    abilities?: Ability[];
    inventory?: InventoryItem[];
}

export default function CharacterDetails() {
    const { id } = useParams();
    const [data, setCharacterData] = useState<CharacterData | null>(null);
    const [loading, setLoading] = useState(true);
    const totalWeight = data?.inventory?.reduce((acc, item) => acc + Number(item.weight), 0);

    const [diceResults, setDiceResults] = useState<number[]>([]);
    const [diceSumResults, setDiceSumResults] = useState<number[]>([]);
    const [diceMaxValue, setDiceMaxValue] = useState(0);
    const [diceMinValue, setDiceMinValue] = useState(0);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogCreateSpellOpen, setIsDialogCreateSpellOpen] = useState(false);
    const [isDialogCreateAbilityOpen, setIsDialogCreateAbilityOpen] = useState(false);
    const [isDialogCreateAttributeOpen, setIsDialogCreateAttributeOpen] = useState(false);
    const [isDialogCreateSkillOpen, setIsDialogCreateSkillOpen] = useState(false);
    const [isDialogCreateItemOpen, setIsDialogCreateItemOpen] = useState(false);
    const [isDialogDeleteItemOpen, setIsDialogDeleteItemOpen] = useState(false);
    const [isDialogDeleteAbilityOpen, setIsDialogDeleteAbilityOpen] = useState(false);
    const [isDialogDeleteSpellOpen, setIsDialogDeleteSpellOpen] = useState(false);
    const [isDialogDeleteSkillOpen, setIsDialogDeleteSkillOpen] = useState(false);

    const [name, setName] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [costType, setCostType] = useState<string | null>(null);
    const [cost, setCost] = useState<number | null>(null);
    const [diceQtd, setDiceQtd] = useState<number | null>(null);
    const [diceNumber, setDiceNumber] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number | null>(null);
    const [weight, setWeight] = useState<number | null>(null);
    const [value, setValue] = useState<number | null>(null);
    const [parent_attribute, setParent_attribute] = useState<string | null>(null);

    const [atr_id, setAtr_id] = useState<number | null>(null);
    const [item_id, setItem_id] = useState<number | null>(null);
    const [abl_id, setAbl_id] = useState<number | null>(null);
    const [spell_id, setSpell_id] = useState<number>(0);
    const [skill_id, setSkill_id] = useState<number | null>(null);

    const [isDialogLoading, setIsDialogLoading] = useState(false);
    const [isDialogAbilityLoading, setIsDialogAbilityLoading] = useState(false);
    const [isDialogSkillLoading, setIsDialogSkillLoading] = useState(false);
    const [isDialogSpellLoading, setIsDialogSpellLoading] = useState(false);
    const [isDialogItemLoading, setIsDialogItemLoading] = useState(false);
    const [isDialogAttributeLoading, setIsDialogAttributeLoading] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const [editedCharStatus, setEditedCharStatus] = useState({
        current_health: 0,
        max_health: 0,
        current_stamina: 0,
        max_stamina: 0,
        current_mana: 0,
        max_mana: 0,
        current_sanity: 0,
        max_sanity: 0,
        money: 0,
        armor_class: 0,
        movement: 0,
        initiative: 0
    });

    const [editingAbilityIndex, setEditingAbilityIndex] = useState<number | null>(null);
    const [editedAbility, setEditedAbility] = useState({ name: '', description: '' });

    const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
    const [editedSkill, setEditedSkill] = useState({ name: '', value: 0, parent_attribute: '' });

    const [editingAttributeIndex, setEditingAttributeIndex] = useState<number | null>(null);
    const [editedAttribute, setEditedAttribute] = useState({ name: '', value: 0 });

    const [isEditChar, setIsEditChar] = useState(false);
    const [editedChar, setEditedChar] = useState({ name: '', age: 0, class: '', sub_class: '', nacionality: '' });

    type StatusKey = 'current_health' | 'max_health' | 'current_stamina' | 'max_stamina' | 'current_mana' | 'max_mana' | 'current_sanity' | 'max_sanity' | 'money';

    const clearFormFields = () => {
        setName("");
        setDescription("");
        setCost(null);
        setCostType("");
        setDiceNumber(null);
        setDiceQtd(null);
        setQuantity(null);
        setWeight(null);
        setValue(null);
        setParent_attribute("");
    };

    const handleSearchClick = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleDeleteItemClick = (item_id: number) => {
        setItem_id(item_id);
        setIsDialogDeleteItemOpen(true);
    };

    const handleDeleteAbilityClick = (abl_id: number) => {
        setAbl_id(abl_id);
        setIsDialogDeleteAbilityOpen(true);
    };

    const handleDeleteSpellClick = (spell_id: number) => {
        setSpell_id(spell_id);
        setIsDialogDeleteSpellOpen(true);
    };

    const handleDeleteSkillClick = (skill_id: number) => {
        setSkill_id(skill_id);
        setIsDialogDeleteSkillOpen(true);
    };

    useEffect(() => {
        const fetchCharacterData = async () => {
            if (id) {
                try {
                    const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                        withCredentials: true,
                    });
                    setCharacterData(response.data);
                    console.log(response.data);

                    setEditedCharStatus({
                        current_health: response.data.character.current_health,
                        max_health: response.data.character.max_health,
                        current_stamina: response.data.character.current_stamina,
                        max_stamina: response.data.character.max_stamina,
                        current_mana: response.data.character.current_mana,
                        max_mana: response.data.character.max_mana,
                        current_sanity: response.data.character.current_sanity,
                        max_sanity: response.data.character.max_sanity,
                        money: response.data.character.money,
                        armor_class: response.data.character.armor_class,
                        movement: response.data.character.movement,
                        initiative: response.data.character.initiative,
                    });

                    setLoading(false);
                } catch (error) {
                    console.error('Erro ao buscar detalhes do personagem: ', error);
                    setLoading(false);
                }
            }
        };

        fetchCharacterData();
    }, [id]);

    const rollDice = async (diceNumber: number, atr_value: number) => {
        setIsDialogOpen(true);
        setIsDialogLoading(true);
        const diceData = {
            diceNumber: diceNumber,
            diceQtd: Math.abs(atr_value)
        };

        try {
            const response: AxiosResponse = await axios.post('https://tabuleiro-backend.onrender.com/dice/roll', diceData, {
                withCredentials: true,
            });

            const results = response.data.result;
            if (results && Array.isArray(results)) {
                setDiceResults(results)
                setDiceSumResults(results.reduce((acc, curr) => acc + curr, 0));
                setDiceMaxValue(Math.max(...results));
                setDiceMinValue(Math.min(...results));
                setIsDialogLoading(false);
            } else {
                console.error('Formato de resposta inesperado: ', response.data);
            }
        } catch (error: AxiosError | any) {
            console.error('Erro ao rolar os dados: ', error);
        }
    };

    const rollSkillCheck = async (diceNumber: number, atr_value: number, parent_attribute: string) => {
        setIsDialogOpen(true);
        setIsDialogLoading(true);
        const diceData = {
            diceNumber: diceNumber,
            diceQtd: Math.abs(atr_value)
        };

        try {
            const response: AxiosResponse = await axios.post('https://tabuleiro-backend.onrender.com/dice/roll', diceData, {
                withCredentials: true,
            });

            const results = response.data.result;
            if (results && Array.isArray(results)) {
                setDiceResults(results)
                setDiceSumResults(results.reduce((acc, curr) => acc + curr, 0));
                setDiceMaxValue(Math.max(...results));
                setDiceMinValue(Math.min(...results));
                setIsDialogLoading(false);
            } else {
                console.error('Formato de resposta inesperado: ', response.data);
            }
        } catch (error: AxiosError | any) {
            console.error('Erro ao rolar os dados: ', error);
        }
    };


    const handleEditSkillClick = (skill: Skill) => {
        if (editingSkillIndex === skill.id) {
            setEditingSkillIndex(null);
        } else {
            setEditingSkillIndex(skill.id);
            setEditedSkill({
                name: skill.name,
                value: skill.value,
                parent_attribute: skill.parent_attribute ?? ''
            });
        }
    }

    const handleEditAbilityClick = (ability: Ability) => {
        if (editingAbilityIndex === ability.id) {
            setEditingAbilityIndex(null);
        } else {
            setEditingAbilityIndex(ability.id);
            setEditedAbility({
                name: ability.name,
                description: ability.description
            });
        }
    };

    const handleEditAttributeClick = (attribute: Attribute) => {
        if (editingAttributeIndex === attribute.id) {
            setEditingAttributeIndex(null);
        } else {
            setEditingAttributeIndex(attribute.id);
            setEditedAttribute({
                name: attribute.name,
                value: attribute.value
            });
        }
    };

    const handleEditCharClick = (character: Character | undefined) => {
        if (isEditChar) {
            setIsEditChar(false);
        } else {
            if (character) {
                setIsEditChar(true);
                setEditedChar({
                    name: character.name,
                    age: character.age !== null ? character.age : 0,
                    nacionality: character.nacionality,
                    class: character.char_class,
                    sub_class: character.char_subclass,
                });
            } else {
                console.error("Character is undefined");
            }
        }
    };

    const handleInputChangeChar = (e: { target: { name: any; value: any; }; }) => {
        if (e && e.target) {
            const { name, value } = e.target;
            setEditedChar((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleInputChangeCharStatus = (e: { target: { name: any; value: any; }; }) => {
        if (e && e.target) {
            const { name, value } = e.target;
            setEditedCharStatus((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleInputChangeAbility = (e: { target: { name: any; value: any; }; }) => {
        if (e && e.target) {
            const { name, value } = e.target;
            setEditedAbility((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleInputChangeSkill = (e: { target: { name: any; value: any; }; }) => {
        if (e && e.target) {
            const { name, value } = e.target;
            setEditedSkill((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleInputChangeAttribute = (e: { target: { name: any; value: any; }; }) => {
        if (e && e.target) {
            const { name, value } = e.target;
            setEditedAttribute((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const subtractCurrentStatus = (statusKey: StatusKey) => {
        setEditedCharStatus((prevStatus) => {
            const newStatus = {
                ...prevStatus,
                [statusKey]: Math.max((prevStatus[statusKey] || 0) - 10, 0),
            };

            updateCharacterStatus(newStatus);
            return newStatus;
        });
    };

    const sumCurrentStatus = (statusKey: StatusKey) => {
        setEditedCharStatus((prevStatus) => {
            const newStatus = {
                ...prevStatus,
                [statusKey]: parseFloat((prevStatus[statusKey] ?? '0').toString()) + 10
            };

            updateCharacterStatus(newStatus);
            return newStatus;
        });
    };

    const updateCharacterStatus = async (updatedStatus: {
        current_health: number;
        max_health: number;
        current_stamina: number;
        max_stamina: number;
        current_mana: number;
        max_mana: number;
        current_sanity: number;
        max_sanity: number;
        money: number;
        armor_class: number;
        movement: number;
        initiative: number;
    }) => {
        const updatedCharacterData = {
            current_health: updatedStatus.current_health,
            max_health: updatedStatus.max_health,
            current_stamina: updatedStatus.current_stamina,
            max_stamina: updatedStatus.max_stamina,
            current_mana: updatedStatus.current_mana,
            max_mana: updatedStatus.max_mana,
            current_sanity: updatedStatus.current_sanity,
            max_sanity: updatedStatus.max_sanity,
            money: updatedStatus.money,
            armor_class: updatedStatus.armor_class,
            movement: updatedStatus.movement,
            initiative: updatedStatus.initiative,
        };

        try {
            const response: AxiosResponse = await axios.put(
                `https://tabuleiro-backend.onrender.com/characters/update/${id}`,
                updatedCharacterData,
                {
                    withCredentials: true,
                }
            );
            console.log(response.data);
            setCharacterData((prevState) => {
                if (prevState) {
                    return {
                        ...prevState,
                        character: {
                            ...prevState.character,
                            ...updatedCharacterData,
                        },
                    };
                }
                return null;
            });
        } catch (error: AxiosError | any) {
            console.error('Erro ao atualizar os dados: ', error);
        }
    };


    const updateCharacterBio = async () => {
        setIsButtonLoading(true);
        const updatedCharacterData = {
            name: editedChar.name,
            age: editedChar.age,
            nacionality: editedChar.nacionality,
            char_class: editedChar.class,
            char_subclass: editedChar.sub_class,
        };

        try {
            const response: AxiosResponse = await axios.put(
                `https://tabuleiro-backend.onrender.com/characters/update/${id}`,
                updatedCharacterData,
                {
                    withCredentials: true,
                }
            );
            console.log(response.data);

            setCharacterData((prevData) => {
                if (prevData) {
                    return {
                        ...prevData,
                        character: {
                            ...prevData.character,
                            ...updatedCharacterData,
                        },
                    };
                }
                return null;
            });

            setIsEditChar(false);
            setIsButtonLoading(false);
        } catch (error: AxiosError | any) {
            console.error('Erro ao atualizar os dados: ', error);
        }
    };


    const createSpell = async () => {
        setIsDialogSpellLoading(true);
        const spellData = {
            name: name,
            description: description,
            cost: cost,
            cost_type: costType,
            diceNumber: diceNumber,
            diceQtd: diceQtd,
            char_id: id,
        };

        try {
            await axios.post('https://tabuleiro-backend.onrender.com/spells/create', spellData, {
                withCredentials: true,
            });

            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setCharacterData(response.data);
            setIsDialogCreateSpellOpen(false);
            clearFormFields();
            setIsDialogSpellLoading(false);
        } catch (error: AxiosError | any) {
            console.error('Erro ao cadastrar ataque: ', error);
        }
    };

    const deleteSpell = async () => {
        try {
            await axios.delete(`https://tabuleiro-backend.onrender.com/spells/delete/${id}/${spell_id}`, {
                withCredentials: true,
            });

            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setCharacterData(response.data);
            setIsDialogDeleteSpellOpen(false);
            setExpandedIndex(null);
        } catch (error: AxiosError | any) {
            console.error('Erro ao excluir ataque: ', error);
        }
    };

    const createSkill = async () => {
        setIsDialogSkillLoading(true);
        const skillData = {
            name: name,
            value: value,
            parent_attribute: parent_attribute,
            char_id: id,
        };

        try {
            await axios.post('https://tabuleiro-backend.onrender.com/skills/create', skillData, {
                withCredentials: true,
            });

            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setCharacterData(response.data);
            setIsDialogCreateSkillOpen(false);
            clearFormFields();
            setIsDialogSkillLoading(false);
        } catch (error: AxiosError | any) {
            console.error('Erro ao cadastrar aptidão: ', error);
        }
    };

    const updateSkill = async () => {
        const updatedSkillData = {
            name: editedSkill.name,
            value: editedSkill.value,
            parent_attribute: editedSkill.parent_attribute,
            char_id: id,
            skill_id: editingSkillIndex,
        };

        try {
            await axios.put(
                `https://tabuleiro-backend.onrender.com/skills/update`,
                updatedSkillData,
                {
                    withCredentials: true,
                }
            );
            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setEditingSkillIndex(null);
            setCharacterData(response.data);
            clearFormFields();
        } catch (error: AxiosError | any) {
            console.error('Erro ao atualizar os dados: ', error);
        }
    };

    const deleteSkill = async () => {
        try {
            await axios.delete(`https://tabuleiro-backend.onrender.com/skills/delete/${id}/${skill_id}`, {
                withCredentials: true,
            });

            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setCharacterData(response.data);
            setSkill_id(null);
            setIsDialogDeleteSkillOpen(false);
        } catch (error: AxiosError | any) {
            console.error('Erro ao excluir habilidade: ', error);
        }
    };

    const createAbility = async () => {
        setIsDialogAbilityLoading(true);
        const abilityData = {
            name: name,
            description: description,
            char_id: id,
        };

        try {
            await axios.post('https://tabuleiro-backend.onrender.com/ability/create', abilityData, {
                withCredentials: true,
            });

            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setCharacterData(response.data);
            setIsDialogCreateAbilityOpen(false);
            clearFormFields();
            setIsDialogAbilityLoading(false);
        } catch (error: AxiosError | any) {
            console.error('Erro ao cadastrar habilidade: ', error);
        }
    };

    const updateAbility = async () => {
        setIsButtonLoading(true);
        const updatedAbilityData = {
            name: editedAbility.name,
            description: editedAbility.description,
            char_id: id,
            abl_id: editingAbilityIndex,
        };

        try {
            await axios.put(
                `https://tabuleiro-backend.onrender.com/ability/update`,
                updatedAbilityData,
                {
                    withCredentials: true,
                }
            );
            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setEditingAbilityIndex(null);
            setCharacterData(response.data);
            setIsButtonLoading(false);
        } catch (error: AxiosError | any) {
            console.error('Erro ao atualizar os dados: ', error);
        }
    };

    const deleteAbility = async () => {
        try {
            await axios.delete(`https://tabuleiro-backend.onrender.com/ability/delete/${id}/${abl_id}`, {
                withCredentials: true,
            });

            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setCharacterData(response.data);
            setAbl_id(null);
            setIsDialogDeleteAbilityOpen(false);
        } catch (error: AxiosError | any) {
            console.error('Erro ao excluir habilidade: ', error);
        }
    };

    const createAttribute = async () => {
        setIsDialogAttributeLoading(true);
        const attributeData = {
            name: name,
            diceNumber: diceNumber,
            value: value,
            char_id: id,
        };

        try {
            await axios.post('https://tabuleiro-backend.onrender.com/attributes/create', attributeData, {
                withCredentials: true,
            });

            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setCharacterData(response.data);
            setIsDialogCreateAttributeOpen(false);
            clearFormFields();
            setIsDialogAttributeLoading(false);
        } catch (error: AxiosError | any) {
            console.error('Erro ao cadastrar atributo: ', error);
        }
    };

    const updateAttribute = async () => {
        const updatedAttributeData = {
            name: editedAttribute.name,
            value: editedAttribute.value,
            char_id: id,
            atr_id: editingAttributeIndex,
        };

        try {
            await axios.put(
                `https://tabuleiro-backend.onrender.com/attributes/update`,
                updatedAttributeData,
                {
                    withCredentials: true,
                }
            );
            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setEditingAttributeIndex(null);
            setCharacterData(response.data);
            clearFormFields();
        } catch (error: AxiosError | any) {
            console.error('Erro ao atualizar os dados: ', error);
        }
    };

    const deleteAttribute = async (atr_id: number | null) => {
        setAtr_id(atr_id);
        try {
            await axios.delete(`https://tabuleiro-backend.onrender.com/attributes/delete/${id}/${atr_id}`, {
                withCredentials: true,
            });

            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setCharacterData(response.data);
            clearFormFields();
        } catch (error: AxiosError | any) {
            console.error('Erro ao cadastrar atributo: ', error);
        }
    };

    const createItem = async () => {
        setIsDialogItemLoading(true);
        const itemData = {
            item: name,
            quantity: quantity,
            weight: weight,
            diceNumber: diceNumber,
            diceQtd: diceQtd,
            char_id: id,
        };

        try {
            await axios.post('https://tabuleiro-backend.onrender.com/inventory/create', itemData, {
                withCredentials: true,
            });

            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setCharacterData(response.data);
            setIsDialogCreateItemOpen(false);
            clearFormFields();
            setIsDialogItemLoading(false);
        } catch (error: AxiosError | any) {
            console.error('Erro ao cadastrar item: ', error);
        }
    };

    const deleteItem = async () => {
        try {
            await axios.delete(`https://tabuleiro-backend.onrender.com/inventory/delete/${id}/${item_id}`, {
                withCredentials: true,
            });

            const response = await axios.get(`https://tabuleiro-backend.onrender.com/characters/get-all-character/${id}`, {
                withCredentials: true,
            });
            setCharacterData(response.data);
            setIsDialogDeleteItemOpen(false);
        } catch (error: AxiosError | any) {
            console.error('Erro ao excluir item: ', error);
        }
    };

    const getCostBackgroundClass = (costType: string) => {
        switch (costType) {
            case 'Mana':
                return 'bg-manaBar outline outline-2 outline-[#718CAC]';
            case 'Vida':
                return 'bg-healthBar outline outline-2 outline-[#DF6565]';
            case 'Stamina':
                return 'bg-staminaBar outline outline-2 outline-[#92AF7B]';
            case 'Sanidade':
                return 'bg-sanityBar outline outline-2 outline-[#8775AE]';
            default:
                return 'bg-zinc-500 outline outline-2 outline-gray-400';
        }
    };

    const truncateText = (text: string, maxLength: number): string => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    };

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-tabuleiro2 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`${poppins.className}`}>

            {/* Modal resultado da rolagem de dados */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <AlertDialogContent className={`${poppins.className}`} >
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Resultado da Rolagem</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            {isDialogLoading ? (
                                <GiDiceTwentyFacesTwenty className="animate-spin h-12 w-12 mx-auto mt-5 text-tabuleiro2" />
                            ) : (
                                <div>
                                    {diceResults.length > 0 ? (
                                        <div className='space-y-2'>
                                            <div className='grid grid-cols-2 gap-2 gap-x-4 font-bold'>
                                                <p className='text-right text-lg'>Dados: </p>
                                                <span className='font-bold text-tabuleiro2 text-left text-lg'>{diceResults.join(', ')}</span>
                                                <p className='text-right'>Soma: </p>
                                                <span className='font-bold text-tabuleiro2 text-left'>{diceSumResults}</span>
                                                <p className='text-right'>Maior valor: </p>
                                                <span className='font-bold text-tabuleiro2 text-left'>{diceMaxValue}</span>
                                                <p className='text-right'>Menor valor: </p>
                                                <span className='font-bold text-tabuleiro2 text-left'>{diceMinValue}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <span>Nenhum resultado disponível.</span>
                                    )}
                                </div>
                            )}

                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro' onClick={() => setIsDialogOpen(false)}>
                            Fechar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal criar ataque/magia */}
            <AlertDialog open={isDialogCreateSpellOpen} onOpenChange={setIsDialogCreateSpellOpen}>
                <AlertDialogContent className={`${poppins.className} w-[600px] max-w-[90vw]`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Novo ataque</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            <div className='space-y-2'>
                                <div className='flex flex-col gap-4 mt-4 items-center'>
                                    <Input type="text" placeholder="Nome" className='w-1/2 border-tabuleiro border-2' maxLength={14} value={name ?? ''} onChange={(e) => setName(e.target.value)} />

                                    <div className='flex items-center gap-2 w-1/2'>
                                        <select className='flex-1 p-2 bg-tabuleiro text-white rounded-md' value={costType ?? ''} onChange={(e) => setCostType(e.target.value)}>
                                            <option value="" disabled>Status a ser gasto</option>
                                            <option value="Vida">Vida</option>
                                            <option value="Stamina">Stamina</option>
                                            <option value="Mana">Mana</option>
                                            <option value="Sanidade">Sanidade</option>
                                        </select>
                                        <Input type="number" placeholder="Custo" className='w-1/3 text-center border-tabuleiro border-2' value={cost ?? ''} onChange={(e) => setCost(Number(e.target.value))} />
                                    </div>

                                    <div className='flex justify-center items-center'>
                                        <Input type="number" placeholder="Qtd" className='w-1/5 text-center border-tabuleiro border-2' value={diceQtd ?? ''} onChange={(e) => setDiceQtd(Number(e.target.value))} />
                                        <p className='text-xl mr-7 ml-7 text-tabuleiro2 font-bold'>d</p>
                                        <Input type="number" placeholder="Dado" className='w-1/5 text-center border-tabuleiro border-2' value={diceNumber ?? ''} onChange={(e) => setDiceNumber(Number(e.target.value))} />
                                    </div>

                                    <Textarea className='w-1/2 border-tabuleiro border-2' placeholder="Solta uma enorme bola de fogo, causando 3d12 de dano na área." value={description ?? ''} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='pt-6'>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro/50' onClick={() => setIsDialogCreateSpellOpen(false)}>
                            Fechar
                        </AlertDialogAction>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro hover:bg-tabuleiro2 hover:text-tabuleiro' onClick={() => createSpell()}>
                            Salvar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal criar habilidade */}
            <AlertDialog open={isDialogCreateAbilityOpen} onOpenChange={setIsDialogCreateAbilityOpen}>
                <AlertDialogContent className={`${poppins.className} w-[600px] max-w-[90vw]`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Nova habilidade</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            <div className='space-y-2'>
                                <div className='flex flex-col gap-4 mt-4 items-center'>
                                    <Input type="text" placeholder="Nome" className='w-1/2 border-tabuleiro border-2' maxLength={14} value={name ?? ''} onChange={(e) => setName(e.target.value)} />
                                    <Textarea className='w-1/2 border-tabuleiro border-2' placeholder="Solta uma enorme bola de fogo, causando 3d12 de dano na área." value={description ?? ''} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='pt-6'>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro/50' onClick={() => setIsDialogCreateAbilityOpen(false)}>
                            Fechar
                        </AlertDialogAction>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro hover:bg-tabuleiro2 hover:text-tabuleiro' onClick={() => createAbility()}>
                            Salvar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal criar atributo */}
            <AlertDialog open={isDialogCreateAttributeOpen} onOpenChange={setIsDialogCreateAttributeOpen}>
                <AlertDialogContent className={`${poppins.className} w-[600px] max-w-[90vw]`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Novo atributo</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            <div className='space-y-2'>
                                <div className='flex flex-col gap-4 mt-4 items-center'>
                                    <Input type="text" placeholder="Nome" className='w-1/2 border-tabuleiro border-2' maxLength={12} value={name ?? ''} onChange={(e) => setName(e.target.value)} />
                                    <Input
                                        type="number"
                                        placeholder="Valor"
                                        className='w-1/2 text-center border-tabuleiro border-2'
                                        value={value ?? ''}
                                        onChange={(e) => setValue(Number(e.target.value))}
                                    />
                                    <div className='flex justify-center items-center'>
                                        <p className='text-xl font-bold text-tabuleiro2'>{value}</p>
                                        <p className='text-xl mr-4 ml-3 text-tabuleiro2 font-bold'>d</p>
                                        <Input
                                            type="number"
                                            placeholder="Dado"
                                            className=' text-center border-tabuleiro border-2'
                                            value={diceNumber ?? ''}
                                            onChange={(e) => setDiceNumber(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='pt-6'>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro/50' onClick={() => setIsDialogCreateAbilityOpen(false)}>
                            Fechar
                        </AlertDialogAction>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro hover:bg-tabuleiro2 hover:text-tabuleiro' onClick={() => createAttribute()}>
                            Salvar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal criar item */}
            <AlertDialog open={isDialogCreateItemOpen} onOpenChange={setIsDialogCreateItemOpen}>
                <AlertDialogContent className={`${poppins.className} w-[600px] max-w-[90vw]`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Novo item</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            <div className='space-y-2'>
                                <div className='flex flex-col gap-4 mt-4 items-center'>
                                    <Input
                                        type="text"
                                        placeholder="Nome"
                                        className='w-1/2 border-tabuleiro border-2'
                                        maxLength={12}
                                        value={name ?? ''}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Quantidade"
                                        className='w-1/2 text-center border-tabuleiro border-2'
                                        value={quantity ?? ''}
                                        onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : null)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Peso do Item"
                                        className='w-1/2 text-center border-tabuleiro border-2'
                                        value={weight ?? ''}
                                        onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : null)}
                                    />
                                    <div className='flex justify-center items-center'>
                                        <Input
                                            type="number"
                                            placeholder="Qtd"
                                            className='w-1/5 text-center border-tabuleiro border-2'
                                            value={diceQtd ?? ''}
                                            onChange={(e) => setDiceQtd(e.target.value ? Number(e.target.value) : null)}
                                        />
                                        <p className='text-xl mr-7 ml-7 text-tabuleiro2 font-bold'>d</p>
                                        <Input
                                            type="number"
                                            placeholder="Dado"
                                            className='w-1/5 text-center border-tabuleiro border-2'
                                            value={diceNumber ?? ''}
                                            onChange={(e) => setDiceNumber(e.target.value ? Number(e.target.value) : null)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='pt-6'>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro/50' onClick={() => setIsDialogCreateItemOpen(false)}>
                            Fechar
                        </AlertDialogAction>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro hover:bg-tabuleiro2 hover:text-tabuleiro' onClick={() => createItem()}>
                            Salvar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal criar aptidao */}
            <AlertDialog open={isDialogCreateSkillOpen} onOpenChange={setIsDialogCreateSkillOpen}>
                <AlertDialogContent className={`${poppins.className} w-[600px] max-w-[90vw]`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Nova aptidão</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            <div className='space-y-2'>
                                <div className='flex flex-col gap-4 mt-4 items-center'>
                                    <Input
                                        type="text"
                                        placeholder="Nome"
                                        className='w-[195px] border-tabuleiro border-2'
                                        maxLength={14}
                                        value={name ?? ''}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <select
                                        className='flex p-2 bg-tabuleiro text-white rounded-md'
                                        value={parent_attribute ?? ''}
                                        onChange={(e) => setParent_attribute(e.target.value)}
                                    >
                                        <option value="" disabled>Selecione um atributo</option>
                                        {data?.attributes?.map((attribute, index) => (
                                            <option key={index} value={attribute.name}>
                                                {attribute.name}
                                            </option>
                                        ))}
                                    </select>
                                    <Input
                                        type="number"
                                        placeholder="Vantagem/Desvantagem"
                                        className='w-[195px] text-center border-tabuleiro border-2 text-xs'
                                        value={value ?? ''}
                                        onChange={(e) => setValue(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='pt-6'>
                        <AlertDialogAction
                            className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro/50'
                            onClick={() => setIsDialogCreateSpellOpen(false)}
                        >
                            Fechar
                        </AlertDialogAction>
                        <AlertDialogAction
                            className='text-tabuleiro2 font-bold bg-tabuleiro hover:bg-tabuleiro2 hover:text-tabuleiro'
                            onClick={() => createSkill()}
                        >
                            Salvar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal excluir item */}
            <AlertDialog open={isDialogDeleteItemOpen} onOpenChange={setIsDialogDeleteItemOpen}>
                <AlertDialogContent className={`${poppins.className} w-[600px] max-w-[90vw]`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Excluir item</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            <div className='space-y-2'>
                                <div className='flex-col '>
                                    <p className='text-md mr-7 ml-7 text-tabuleiro2 font-bold text-center'>Tem certeza que deseja excluir?</p>
                                    <p className='text-md mr-7 ml-7 text-tabuleiro2 font-bold text-center'>Essa ação não poderá ser desfeita.</p>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='pt-6'>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro/50' onClick={() => setIsDialogDeleteItemOpen(false)}>
                            Cancelar
                        </AlertDialogAction>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro hover:bg-healthBar hover:text-white' onClick={() => deleteItem()}>
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal excluir habilidade */}
            <AlertDialog open={isDialogDeleteAbilityOpen} onOpenChange={setIsDialogDeleteAbilityOpen}>
                <AlertDialogContent className={`${poppins.className} w-[600px] max-w-[90vw]`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Excluir habilidade</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            <div className='space-y-2'>
                                <div className='flex-col '>
                                    <p className='text-md mr-7 ml-7 text-tabuleiro2 font-bold text-center'>Tem certeza que deseja excluir?</p>
                                    <p className='text-md mr-7 ml-7 text-tabuleiro2 font-bold text-center'>Essa ação não poderá ser desfeita.</p>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='pt-6'>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro/50' onClick={() => setIsDialogDeleteAbilityOpen(false)}>
                            Cancelar
                        </AlertDialogAction>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro hover:bg-healthBar hover:text-white' onClick={() => deleteAbility()}>
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal excluir skill */}
            <AlertDialog open={isDialogDeleteSkillOpen} onOpenChange={setIsDialogDeleteSkillOpen}>
                <AlertDialogContent className={`${poppins.className} w-[500px] max-w-[80vw]`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Excluir aptidão</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            <div className='space-y-2'>
                                <div className='flex-col '>
                                    <p className='text-md mr-7 ml-7 text-tabuleiro2 font-bold text-center'>Tem certeza que deseja excluir?</p>
                                    <p className='text-md mr-7 ml-7 text-tabuleiro2 font-bold text-center'>Essa ação não poderá ser desfeita.</p>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='pt-6'>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro/50' onClick={() => setIsDialogDeleteSkillOpen(false)}>
                            Cancelar
                        </AlertDialogAction>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro hover:bg-healthBar hover:text-white' onClick={() => deleteSkill()}>
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal excluir ataque */}
            <AlertDialog open={isDialogDeleteSpellOpen} onOpenChange={setIsDialogDeleteSpellOpen}>
                <AlertDialogContent className={`${poppins.className} w-[600px] max-w-[90vw]`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-tabuleiro2 text-center text-xl'>Excluir ataque</AlertDialogTitle>
                        <AlertDialogDescription className='text-white font-md text-center'>
                            <div className='space-y-2'>
                                <div className='flex-col '>
                                    <p className='text-md mr-7 ml-7 text-tabuleiro2 font-bold text-center'>Tem certeza que deseja excluir?</p>
                                    <p className='text-md mr-7 ml-7 text-tabuleiro2 font-bold text-center'>Essa ação não poderá ser desfeita.</p>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='pt-6'>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro/15 hover:bg-tabuleiro/50' onClick={() => setIsDialogDeleteSpellOpen(false)}>
                            Cancelar
                        </AlertDialogAction>
                        <AlertDialogAction className='text-tabuleiro2 font-bold bg-tabuleiro hover:bg-healthBar hover:text-white' onClick={() => deleteSpell()}>
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Navbar />

            <div className="relative flex items-center h-screen p-4">
                <div className="flex flex-col ml-16 pb-12 w-full max-w-sm">
                    <h1 className="text-tabuleiro2 font-bold text-2xl mb-5">{data.character.name}</h1>
                    <div className='bg-tabuleiro/5 p-4 border-solid border-tabuleiro border-2 rounded-3xl relative group'>
                        <div className='bg-tabuleiro/15 p-6 rounded-xl'>
                            <div className="absolute -top-2 -right-2 bg-tabuleiro2 rounded-full p-1 shadow-md shadow-black/40 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                onClick={() => handleEditCharClick(data.character)}
                            >
                                <TbPencil className="h-4 w-4 text-white" />
                            </div>
                            {isEditChar ? (
                                <>
                                    <div className='grid grid-cols-2 gap-x-4'>
                                        <p className='font-bold'>Idade</p>
                                        <p className='font-bold text-right'>Classe</p>
                                        <input
                                            type="number"
                                            name="age"
                                            maxLength={12}
                                            value={editedChar.age}
                                            onChange={handleInputChangeChar}
                                            className="bg-transparent border-2 border-tabuleiro text-white text-left rounded-md w-full py-1 "
                                        />
                                        <input
                                            type="text"
                                            name="class"
                                            maxLength={12}
                                            value={editedChar.class}
                                            onChange={handleInputChangeChar}
                                            className="bg-transparent border-2 border-tabuleiro text-white text-right rounded-md w-full py-1 "
                                        />

                                        <p className='font-bold'>País</p>
                                        <p className='font-bold text-right'>Sub-classe</p>
                                        <input
                                            type="text"
                                            name="nacionality"
                                            maxLength={12}
                                            value={editedChar.nacionality}
                                            onChange={handleInputChangeChar}
                                            className="bg-transparent border-2 border-tabuleiro text-white text-left rounded-md w-full py-1 "
                                        />
                                        <input
                                            type="text"
                                            name="sub_class"
                                            maxLength={12}
                                            value={editedChar.sub_class}
                                            onChange={handleInputChangeChar}
                                            className="bg-transparent border-2 border-tabuleiro text-white text-right rounded-md w-full py-1 "
                                        />

                                    </div>
                                    <div className='flex items-center justify-center pt-2'>
                                        <Button
                                            onClick={() => updateCharacterBio()}
                                            variant={"tabuleiro"}
                                            disabled={isButtonLoading}
                                        >
                                            {isButtonLoading ? (
                                                <FaSpinner className="animate-spin h-5 w-5 mx-auto" />
                                            ) : (
                                                "SALVAR"
                                            )}
                                        </Button>
                                    </div>

                                </>
                            ) : (
                                <div className='grid grid-cols-2 gap-x-4'>
                                    <p className='font-bold'>Idade</p>
                                    <p className='font-bold text-right'>Classe</p>
                                    <p className='font-md mb-4' title={`${data.character.age} anos`}>
                                        {truncateText(`${data.character.age} anos`, 10)}
                                    </p>
                                    <p className='font-md mb-4 text-right' title={data.character.char_class}>
                                        {truncateText(data.character.char_class, 12)}
                                    </p>

                                    <p className='font-bold'>País</p>
                                    <p className='font-bold text-right'>Sub-classe</p>
                                    <p className='font-md' title={data.character.nacionality}>
                                        {truncateText(data.character.nacionality, 12)}
                                    </p>
                                    <p className='font-md text-right' title={data.character.char_subclass}>
                                        {truncateText(data.character.char_subclass, 12)}
                                    </p>
                                </div>
                            )}

                            {/* Progresso de Vida */}
                            <div className="relative w-full mt-4">
                                <div className="flex justify-between mb-1">
                                    <p className="font-bold">Vida</p>
                                    <div className='flex'>
                                        <input
                                            type="number"
                                            name="current_health"
                                            value={Math.round(editedCharStatus.current_health)}
                                            onChange={handleInputChangeCharStatus}
                                            onBlur={() => updateCharacterStatus(editedCharStatus)}
                                            className="w-10 text-center bg-transparent text-white focus:outline-none focus:border-2 focus:border-tabuleiro/50 rounded-md focus:-mb-1"
                                        />
                                        <p className="font-md">
                                            /
                                        </p>
                                        <input
                                            type="number"
                                            name="max_health"
                                            value={Math.round(editedCharStatus.max_health)}
                                            onChange={handleInputChangeCharStatus}
                                            onBlur={() => updateCharacterStatus(editedCharStatus)}
                                            className="w-10 text-center bg-transparent text-white focus:outline-none focus:border-2 focus:border-tabuleiro/50 rounded-md focus:-mb-1"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <button onClick={() => subtractCurrentStatus('current_health')}
                                        className="absolute left-4 top-1 transform -translate-x-1/2 text-white font-bold text-lg z-10">
                                        -
                                    </button>
                                    <Progress
                                        value={(editedCharStatus.current_health / editedCharStatus.max_health) * 100}
                                        variant="health"
                                        indicatorVariant="health"
                                    />
                                    <button onClick={() => sumCurrentStatus('current_health')}
                                        className="absolute right-4 top-1 transform translate-x-1/2 text-white font-bold text-lg z-10">
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Progresso de Stamina */}
                            <div className="relative w-full mt-6">
                                <div className="flex justify-between mb-1">
                                    <p className="font-bold">Stamina</p>
                                    <div className='flex'>
                                        <input
                                            type="number"
                                            name="current_stamina"
                                            value={Math.round(editedCharStatus.current_stamina)}
                                            onChange={handleInputChangeCharStatus}
                                            onBlur={() => updateCharacterStatus(editedCharStatus)}
                                            className="w-10 text-center bg-transparent text-white focus:outline-none focus:border-2 focus:border-tabuleiro/50 rounded-md focus:-mb-1"
                                        />
                                        <p className="font-md">
                                            /
                                        </p>
                                        <input
                                            type="number"
                                            name="max_stamina"
                                            value={Math.round(editedCharStatus.max_stamina)}
                                            onChange={handleInputChangeCharStatus}
                                            onBlur={() => updateCharacterStatus(editedCharStatus)}
                                            className="w-10 text-center bg-transparent text-white focus:outline-none focus:border-2 focus:border-tabuleiro/50 rounded-md focus:-mb-1"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <button onClick={() => subtractCurrentStatus('current_stamina')}
                                        className="absolute left-4 top-1 transform -translate-x-1/2 text-white font-bold text-lg z-10">
                                        -
                                    </button>
                                    <Progress
                                        value={(editedCharStatus.current_stamina / editedCharStatus.max_stamina) * 100}
                                        variant="stamina"
                                        indicatorVariant="stamina"
                                    />
                                    <button onClick={() => sumCurrentStatus('current_stamina')}
                                        className="absolute right-4 top-1 transform translate-x-1/2 text-white font-bold text-lg z-10">
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Progresso de Mana */}
                            <div className="relative w-full mt-6">
                                <div className="flex justify-between mb-1">
                                    <p className="font-bold">Mana</p>
                                    <div className='flex'>
                                        <input
                                            type="number"
                                            name="current_mana"
                                            value={Math.round(editedCharStatus.current_mana)}
                                            onChange={handleInputChangeCharStatus}
                                            onBlur={() => updateCharacterStatus(editedCharStatus)}
                                            className="w-10 text-center bg-transparent text-white focus:outline-none focus:border-2 focus:border-tabuleiro/50 rounded-md focus:-mb-1"
                                        />
                                        <p className="font-md">
                                            /
                                        </p>
                                        <input
                                            type="number"
                                            name="max_mana"
                                            value={Math.round(editedCharStatus.max_mana)}
                                            onChange={handleInputChangeCharStatus}
                                            onBlur={() => updateCharacterStatus(editedCharStatus)}
                                            className="w-10 text-center bg-transparent text-white focus:outline-none focus:border-2 focus:border-tabuleiro/50 rounded-md focus:-mb-1"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <button onClick={() => subtractCurrentStatus('current_mana')}
                                        className="absolute left-4 top-1 transform -translate-x-1/2 text-white font-bold text-lg z-10">
                                        -
                                    </button>
                                    <Progress
                                        value={(editedCharStatus.current_mana / editedCharStatus.max_mana) * 100}
                                        variant="mana"
                                        indicatorVariant="mana"
                                    />
                                    <button onClick={() => sumCurrentStatus('current_mana')}
                                        className="absolute right-4 top-1 transform translate-x-1/2 text-white font-bold text-lg z-10">
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Progresso de Sanidade */}
                            <div className="relative w-full mt-6">
                                <div className="flex justify-between mb-1">
                                    <p className="font-bold">Sanidade</p>
                                    <div className='flex'>
                                        <input
                                            type="number"
                                            name="current_sanity"
                                            value={Math.round(editedCharStatus.current_sanity)}
                                            onChange={handleInputChangeCharStatus}
                                            onBlur={() => updateCharacterStatus(editedCharStatus)}
                                            className="w-10 text-center bg-transparent text-white focus:outline-none focus:border-2 focus:border-tabuleiro/50 rounded-md focus:-mb-1"
                                        />
                                        <p className="font-md">
                                            /
                                        </p>
                                        <input
                                            type="number"
                                            name="max_sanity"
                                            value={Math.round(editedCharStatus.max_sanity)}
                                            onChange={handleInputChangeCharStatus}
                                            onBlur={() => updateCharacterStatus(editedCharStatus)}
                                            className="w-10 text-center bg-transparent text-white focus:outline-none focus:border-2 focus:border-tabuleiro/50 rounded-md focus:-mb-1"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <button onClick={() => subtractCurrentStatus('current_sanity')}
                                        className="absolute left-4 top-1 transform -translate-x-1/2 text-white font-bold text-lg z-10">
                                        -
                                    </button>
                                    <Progress
                                        value={(editedCharStatus.current_sanity / editedCharStatus.max_sanity) * 100}
                                        variant="sanity"
                                        indicatorVariant="sanity"
                                    />
                                    <button onClick={() => sumCurrentStatus('current_sanity')}
                                        className="absolute right-4 top-1 transform translate-x-1/2 text-white font-bold text-lg z-10">
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Progresso de Dinheiro */}
                            <div className="relative w-full mt-6">
                                <div className="flex justify-between">
                                    <p className="font-bold">Dinheiro</p>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => subtractCurrentStatus('money')}
                                            className="text-white font-bold text-lg bg-none p-0 outline-none">
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            name="money"
                                            value={Math.round(editedCharStatus.money)}
                                            onChange={handleInputChangeCharStatus}
                                            onBlur={() => updateCharacterStatus(editedCharStatus)}
                                            className="w-10 text-center bg-transparent text-white focus:outline-none focus:border-2 focus:border-tabuleiro/50 rounded-md focus:-mb-1"
                                        />
                                        <button onClick={() => sumCurrentStatus('money')}
                                            className="text-white font-bold text-lg bg-none p-0 outline-none">
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="relative w-full mt-1">
                                <div className="flex justify-between">
                                    <p className="font-bold">Armadura</p>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            name="armor_class"
                                            value={Math.round(editedCharStatus.armor_class)}
                                            onChange={handleInputChangeCharStatus}
                                            onBlur={() => updateCharacterStatus(editedCharStatus)}
                                            className="w-10 text-center bg-transparent text-white focus:outline-none focus:border-2 focus:border-tabuleiro/50 rounded-md focus:-mb-1"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="relative w-full mt-1">
                                <div className="flex justify-between">
                                    <p className="font-bold">Deslocamento</p>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            name="movement"
                                            value={Math.round(editedCharStatus.movement)}
                                            onChange={handleInputChangeCharStatus}
                                            onBlur={() => updateCharacterStatus(editedCharStatus)}
                                            className="w-10 text-center bg-transparent text-white focus:outline-none focus:border-2 focus:border-tabuleiro/50 rounded-md focus:-mb-1"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="relative w-full mt-1">
                                <div className="flex justify-between">
                                    <p className="font-bold">Iniciativa</p>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            name="initiative"
                                            value={Math.round(editedCharStatus.initiative)}
                                            onChange={handleInputChangeCharStatus}
                                            onBlur={() => updateCharacterStatus(editedCharStatus)}
                                            className="w-10 text-center bg-transparent text-white focus:outline-none focus:border-2 focus:border-tabuleiro/50 rounded-md focus:-mb-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-8 flex space-x-4">
                        <GiD4 className='text-tabuleiro2 text-5xl transition-transform duration-200 hover:scale-110 cursor-pointer' onClick={() => rollDice(4, 1)} />
                        <GiPerspectiveDiceSix className='text-tabuleiro2 text-5xl transition-transform duration-200 hover:scale-110 cursor-pointer' onClick={() => rollDice(6, 1)} />
                        <GiDiceEightFacesEight className='text-tabuleiro2 text-5xl transition-transform duration-200 hover:scale-110 cursor-pointer' onClick={() => rollDice(8, 1)} />
                        <GiD10 className='text-tabuleiro2 text-5xl transition-transform duration-200 hover:scale-110 cursor-pointer' onClick={() => rollDice(10, 1)} />
                        <GiD12 className='text-tabuleiro2 text-5xl transition-transform duration-200 hover:scale-110 cursor-pointer' onClick={() => rollDice(12, 1)} />
                        <GiDiceTwentyFacesTwenty className='text-tabuleiro2 text-5xl transition-transform duration-200 hover:scale-110 cursor-pointer' onClick={() => rollDice(20, 1)} />
                    </div>
                </div>

                <div className='bg-tabuleiro2/35 p-4 pr-0 border-solid border-tabuleiro border-2 rounded-r-3xl '>
                    {isEditChar ? (
                        <ScrollArea className='h-[550px] w-[120px] rounded-md pr-4'>
                            <ul className="grid grid-cols-1 gap-3">
                                {data?.attributes && data.attributes.length > 0 ? (
                                    data.attributes.map((attribute, index) => (
                                        <li
                                            key={index}
                                            className="relative flex flex-col items-center justify-center bg-[#211F46] cursor-pointer border-2 border-tabuleiro rounded-lg h-20 w-24 hover:bg-tabuleiro2/15 group"
                                        >
                                            {atr_id === attribute.id && !isDialogDeleteSpellOpen ? (
                                                <div className="flex flex-col items-center justify-center bg-[#211F46] cursor-pointer border-2 border-tabuleiro rounded-lg h-20 w-24 hover:bg-tabuleiro2/15 animate-pulse">
                                                    <FaSpinner className="animate-spin h-6 w-6 text-white" />
                                                    <p className="text-white text-sm mt-2">Deletando...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div
                                                        className="absolute -top-2 -right-2 z-30 bg-tabuleiro2 rounded-full p-1 shadow-md shadow-black/40 cursor-pointer mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                                        onClick={() => handleEditAttributeClick(attribute)}
                                                    >
                                                        <TbPencil className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div
                                                        className="absolute top-5 -right-2 z-30 bg-healthBar rounded-full p-1 shadow-md shadow-black/40 cursor-pointer mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                                        onClick={() => deleteAttribute(attribute.id)}
                                                    >
                                                        <FaRegTrashCan className="h-4 w-4 text-white" />
                                                    </div>
                                                    {editingAttributeIndex === attribute.id ? (
                                                        <>
                                                            <input
                                                                type="number"
                                                                name="value"
                                                                value={editedAttribute.value}
                                                                onChange={handleInputChangeAttribute}
                                                                className="bg-transparent border-2 border-tabuleiro text-md text-white text-center rounded-md w-full h-40 p-2"
                                                            />
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                maxLength={12}
                                                                value={editedAttribute.name}
                                                                onChange={handleInputChangeAttribute}
                                                                className="bg-transparent border-2 border-tabuleiro text-white text-center text-sm rounded-md w-full py-1 "
                                                            />
                                                            <div
                                                                className="absolute bottom-0 -right-2 z-30 bg-tabuleiro2 rounded-full p-1 shadow-md shadow-black/40 cursor-pointer"
                                                                onClick={() => updateAttribute()}
                                                            >
                                                                <FaCheck className="h-4 w-4 text-white" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-2xl font-bold pb-1">
                                                                {attribute.value}
                                                            </span>

                                                            <div className='absolute bottom-1 bg-tabuleiro2 w-full -mb-2 rounded-b-lg text-center'>
                                                                <span className="font-bold text-sm ">{attribute.name}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <li>Nenhum atributo disponível</li>
                                )}
                                <div onClick={() => setIsDialogCreateAttributeOpen(true)} className="flex border-dashed border-2 border-tabuleiro2 w-24 h-20 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/30 duration-150 cursor-pointer">
                                    <p className="text-tabuleiro2 text-3xl text-center font-bold">+</p>
                                </div>
                            </ul>
                        </ScrollArea>
                    ) : (
                        <ScrollArea className='h-[550px] w-[120px] rounded-md pr-4'>
                            <ul className="grid grid-cols-1 gap-3">
                                {data?.attributes && data.attributes.length > 0 ? (
                                    data.attributes.map((attribute, index) => (
                                        <li
                                            key={index}
                                            className="relative flex flex-col items-center justify-center bg-[#211F46] cursor-pointer border-2 border-tabuleiro rounded-lg h-20 w-24 hover:bg-tabuleiro2/15"
                                            onClick={() => rollDice(attribute.dicenumber, attribute.value)}
                                        >
                                            <span className="text-2xl font-bold pb-1">
                                                {attribute.value}
                                            </span>

                                            <div className='absolute bottom-1 bg-tabuleiro2 w-full -mb-2 rounded-b-lg text-center'>
                                                <span className="font-bold text-sm ">{attribute.name}</span>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li>Nenhum atributo disponível</li>
                                )}
                                {isDialogAttributeLoading && (
                                    <li className="flex flex-col items-center justify-center bg-[#211F46] cursor-pointer border-2 border-tabuleiro rounded-lg h-20 w-24 hover:bg-tabuleiro2/15 animate-pulse">
                                        <div className="text-white font-bold text-md">
                                            <FaSpinner className="animate-spin h-5 w-5 mx-auto" />
                                        </div>
                                    </li>
                                )}
                                <div onClick={() => setIsDialogCreateAttributeOpen(true)} className="flex border-dashed border-2 border-tabuleiro2 w-24 h-20 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/30 duration-150 cursor-pointer">
                                    <p className="text-tabuleiro2 text-3xl text-center font-bold">+</p>
                                </div>
                            </ul>
                        </ScrollArea>
                    )}
                </div>

                <div className="flex flex-col ml-12">
                    <h1 className="text-tabuleiro2 font-bold text-2xl mb-5">Aptidões</h1>
                    <div className='bg-tabuleiro/5 p-4 border-solid border-tabuleiro border-2 rounded-3xl'>
                        <div className='bg-tabuleiro/15 p-4 pb-0 rounded-xl'>
                            <ScrollArea className='h-[655px] w-[120px] rounded-md pr-2'>
                                <ul className="grid grid-cols-1 gap-3">
                                    {data?.skills && data.skills.length > 0 ? (
                                        data.skills.map((skills, index) => (
                                            <li
                                                key={index}
                                                className="relative flex flex-col items-center justify-center w-24 h-24 border-2 border-tabuleiro2 rounded-lg shadow-md bg-tabuleiro/15 mx-auto group"
                                            >
                                                {skill_id === skills.id && !isDialogDeleteSkillOpen ? (
                                                    <div className="flex flex-col items-center justify-center h-full w-full animate-pulse">
                                                        <FaSpinner className="animate-spin h-7 w-7 text-white" />
                                                        <p className="text-white mt-2 text-sm">Deletando...</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className='absolute -top-1 -right-2 z-30 bg-tabuleiro2 rounded-full p-1 shadow-md shadow-black/40 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150'
                                                            onClick={() => handleEditSkillClick(skills)}
                                                        >
                                                            <TbPencil className="h-4 w-4 text-white" />
                                                        </div>
                                                        <div className="absolute top-5 -right-2 z-30 bg-healthBar rounded-full p-1 shadow-md shadow-black/40 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                                            onClick={() => skills.id && handleDeleteSkillClick(skills.id)}
                                                        >
                                                            <FaRegTrashCan className="h-4 w-4 text-white" />
                                                        </div>

                                                        {editingSkillIndex === skills.id ? (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    maxLength={15}
                                                                    value={editedSkill.name}
                                                                    onChange={handleInputChangeSkill}
                                                                    className="bg-transparent border-2 border-tabuleiro text-white text-center rounded-md w-full text-sm p-1"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    name="value"
                                                                    value={editedSkill.value}
                                                                    onChange={handleInputChangeSkill}
                                                                    className="bg-transparent border-2 border-tabuleiro text-white text-center rounded-md w-full "
                                                                />
                                                                <select
                                                                    className='bg-tabuleiro border-2 border-tabuleiro text-white text-center rounded-md w-full text-sm p-1'
                                                                    value={editedSkill.parent_attribute ?? ''}
                                                                    onChange={(e) => setEditedSkill((prevSkill) => ({
                                                                        ...prevSkill,
                                                                        parent_attribute: e.target.value
                                                                    }))}
                                                                >
                                                                    <option value="" disabled>Selecione um atributo</option>
                                                                    {data?.attributes?.map((attribute, index) => (
                                                                        <option key={index} value={attribute.name}>
                                                                            {attribute.name}
                                                                        </option>
                                                                    ))}
                                                                </select>

                                                                <div
                                                                    className="absolute bottom-0 -right-2 z-30 bg-tabuleiro2 rounded-full p-1 shadow-md shadow-black/40 cursor-pointer"
                                                                    onClick={() => updateSkill()}
                                                                >
                                                                    <FaCheck className="h-4 w-4 text-white" />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className='absolute top-0 bg-tabuleiro2 w-full max-w-full rounded-t-md text-center overflow-hidden'>
                                                                    <span className="font-bold text-sm text-white truncate px-2" title={skills.name}>
                                                                        {skills.name.length > 12 ? `${skills.name.substring(0, 12)}...` : skills.name}
                                                                    </span>
                                                                </div>
                                                                <span className="text-2xl font-bold pt-5">
                                                                    {skills.value}
                                                                </span>
                                                                <span className="text-md font-bold">
                                                                    {skills.parent_attribute ? skills.parent_attribute.substring(0, 3) : 'N/A'}
                                                                </span>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </li>
                                        ))
                                    ) : (
                                        <li className='flex items-center justify-center text-center'>Nenhuma aptidão disponível</li>
                                    )}

                                    {isDialogSkillLoading && (
                                        <li className="flex flex-col items-center justify-center bg-[#211F46] cursor-pointer border-2 border-tabuleiro rounded-lg h-24 w-24 hover:bg-tabuleiro2/15 animate-pulse mx-auto">
                                            <div className="text-white font-bold text-md">
                                                <FaSpinner className="animate-spin h-5 w-5 mx-auto" />
                                            </div>
                                        </li>
                                    )}

                                    <div onClick={() => setIsDialogCreateSkillOpen(true)}
                                        className="flex border-dashed border-2 border-tabuleiro2 w-24 h-24 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/30 duration-150 cursor-pointer mx-auto">
                                        <p className="text-tabuleiro2 text-3xl text-center font-bold">+</p>
                                    </div>
                                </ul>
                            </ScrollArea>
                        </div>
                    </div>
                </div>


                <div className="flex flex-col p-4 gap-8 pt-18 max-w-[920px]">
                    <div className="flex flex-col ml-10">
                        <h1 className="text-tabuleiro2 font-bold text-2xl mb-5">Ataques & Magias</h1>
                        <div className='bg-tabuleiro/5 p-4 border-solid border-tabuleiro border-2 rounded-3xl'>
                            <div className='bg-tabuleiro/15 p-4 pb-0 rounded-xl '>
                                <ScrollArea className=" w-[800px] overflow-x-auto pb-5">
                                    <ul className="flex gap-6">
                                        {data?.spells && data.spells.length > 0 ? (
                                            data.spells.map((spells, index) => (
                                                <li key={index} className="relative w-44 h-60 perspective">
                                                    {spell_id === spells.id && !isDialogDeleteSpellOpen ? (
                                                        <div className="card-front flex flex-col items-center justify-center bg-[#211F46] border-2 border-tabuleiro rounded-lg h-full w-full animate-pulse">
                                                            <FaSpinner className="animate-spin h-8 w-8 text-white" />
                                                            <p className="text-white mt-2">Deletando...</p>
                                                        </div>
                                                    ) : (
                                                        <div className={`card ${expandedIndex === index ? 'flipped' : ''}`}>
                                                            {/* Parte da frente da carta */}
                                                            <div className="card-front flex flex-col items-center justify-center bg-[#211F46] border-2 border-tabuleiro rounded-lg h-full">
                                                                <div
                                                                    className="absolute -top-2 -right-2 z-20 bg-tabuleiro2 rounded-full p-1 shadow-md shadow-black/40 cursor-pointer mt-2"
                                                                    onClick={() => handleSearchClick(index)}
                                                                >
                                                                    <IoSearchSharp className="h-4 w-4 text-white" />
                                                                </div>
                                                                <div className='absolute top-0 bg-tabuleiro2 w-full h-1/5 rounded-t-lg text-center z-10'>
                                                                    <p className="font-bold text-md pt-3">{spells.name}</p>
                                                                </div>
                                                                <div className='flex flex-col gap-5'>
                                                                    <div className='flex justify-between pt-14'>
                                                                        <p className="text-md font-bold mr-9 p-1">Dano</p>
                                                                        <p className="text-md font-bold text-right bg-healthBar p-1 pl-2 pr-2 outline outline-2 outline-[#DF6565] rounded-md shadow-md shadow-black/50">
                                                                            {spells.diceqtd}d{spells.dicenumber}
                                                                        </p>
                                                                    </div>
                                                                    <div className='flex justify-between'>
                                                                        <p className="text-md font-bold p-1 ">{spells.cost_type}</p>
                                                                        <p className={`text-md font-bold text-right bg-healthBar p-1 pl-2 pr-2 rounded-md shadow-md shadow-black/50 mb-6 ${getCostBackgroundClass(spells.cost_type)}`}> {spells.cost} </p>
                                                                    </div>
                                                                </div>
                                                                <Button onClick={() => rollDice(spells.dicenumber, spells.diceqtd)} variant={'attackCard'} className='w-2/3'>Usar</Button>
                                                            </div>

                                                            {/* Parte de trás da carta */}
                                                            <div className="card-back flex flex-col items-center justify-center bg-tabuleiro rounded-lg h-full border border-2 border-tabuleiro2">

                                                                <div
                                                                    className="absolute top-5 -right-2 z-20 bg-healthBar rounded-full p-1 shadow-md shadow-black/40 cursor-pointer mt-2"
                                                                    onClick={() => handleDeleteSpellClick(spells.id)}
                                                                >
                                                                    <FaRegTrashCan className="h-4 w-4 text-white" />
                                                                </div>

                                                                <p className="text-white text-xs font-md text-center p-2">{spells.description}</p>
                                                                <div className=''>
                                                                    <Image
                                                                        src="/assets/Octahedron.svg"
                                                                        width={55}
                                                                        height={55}
                                                                        alt="Tabuleiro Icon"
                                                                        className="transform rotate-[-30deg]"
                                                                    />
                                                                </div>

                                                                <div
                                                                    className="absolute -top-2 -right-2 z-20 bg-tabuleiro2 rounded-full p-1 shadow-md shadow-black/40 cursor-pointer mt-2"
                                                                    onClick={() => handleSearchClick(index)}
                                                                >
                                                                    <IoSearchSharp className="h-4 w-4 text-white" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </li>
                                            ))
                                        ) : (
                                            <li>Nenhum ataque disponível</li>
                                        )}
                                        {isDialogSpellLoading && (
                                            <li className="relative flex flex-col items-center justify-center bg-[#211F46] border-2 border-tabuleiro rounded-lg h-60 w-44 animate-pulse">
                                                <div className="text-white font-bold text-md">
                                                    <FaSpinner className="animate-spin h-5 w-5 mx-auto" />
                                                </div>
                                            </li>
                                        )}
                                        <div onClick={() => setIsDialogCreateSpellOpen(true)} className="flex border-dashed border-2 border-tabuleiro2 w-44 h-60 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/30 duration-150 cursor-pointer">
                                            <p className="text-tabuleiro2 text-3xl text-center font-bold">+</p>
                                        </div>
                                    </ul>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col ml-10 max-w-[920px]">
                        <h1 className="text-tabuleiro2 font-bold text-2xl mb-5">Habilidades</h1>
                        <div className='bg-tabuleiro/5 p-4 border-solid border-tabuleiro border-2 rounded-3xl'>
                            <div className='bg-tabuleiro/15 p-4 pb-0 rounded-xl'>
                                <ScrollArea className="w-[800px] overflow-x-auto pb-5">
                                    <ul className="flex gap-6">
                                        {data?.abilities && data.abilities.length > 0 ? (
                                            data.abilities.map((ability, index) => (
                                                <li
                                                    key={index}
                                                    className="relative flex flex-col items-center justify-center bg-[#211F46] border-2 border-tabuleiro rounded-lg h-60 w-44 group"
                                                >
                                                    {/* Exibir estado de carregamento para a habilidade sendo deletada */}
                                                    {abl_id === ability.id && !isDialogDeleteAbilityOpen ? (
                                                        <div className="flex flex-col items-center justify-center h-full w-full animate-pulse">
                                                            <FaSpinner className="animate-spin h-8 w-8 text-white" />
                                                            <p className="text-white mt-2">Deletando...</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div
                                                                className="absolute -top-2 -right-2 z-30 bg-tabuleiro2 rounded-full p-1 shadow-md shadow-black/40 cursor-pointer mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                                                onClick={() => handleEditAbilityClick(ability)}
                                                            >
                                                                <TbPencil className="h-4 w-4 text-white" />
                                                            </div>
                                                            <div
                                                                className="absolute top-5 -right-2 z-30 bg-healthBar rounded-full p-1 shadow-md shadow-black/40 cursor-pointer mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                                                onClick={() => handleDeleteAbilityClick(ability.id)}
                                                            >
                                                                <FaRegTrashCan className="h-4 w-4 text-white" />
                                                            </div>

                                                            {editingAbilityIndex === ability.id ? (
                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        maxLength={12}
                                                                        value={editedAbility.name}
                                                                        onChange={handleInputChangeAbility}
                                                                        className="bg-transparent border-2 border-tabuleiro text-white text-center rounded-md w-full py-1 "
                                                                    />
                                                                    <textarea
                                                                        name="description"
                                                                        value={editedAbility.description}
                                                                        onChange={handleInputChangeAbility}
                                                                        className="bg-transparent border-2 border-tabuleiro text-xs text-white rounded-md w-full h-48 p-2 mt-2"
                                                                    />
                                                                    <Button
                                                                        onClick={() => updateAbility()}
                                                                        variant={"tabuleiro"}
                                                                        disabled={isButtonLoading}
                                                                    >
                                                                        {isButtonLoading ? (
                                                                            <FaSpinner className="animate-spin h-5 w-5 mx-auto" />
                                                                        ) : (
                                                                            "SALVAR"
                                                                        )}
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className='absolute top-0 bg-tabuleiro2 w-full rounded-t-lg text-center z-20'>
                                                                        <p className="font-bold text-md pt-1">{ability.name}</p>
                                                                    </div>
                                                                    <ScrollArea className='overflow-y-auto text-xs p-2 pt-6 break-words max-h-[220px] z-10'>
                                                                        <p>{ability.description}</p>
                                                                    </ScrollArea>
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </li>
                                            ))
                                        ) : (
                                            <li>Nenhuma habilidade disponível</li>
                                        )}
                                        {/* Card temporário de carregamento para criação de habilidade */}
                                        {isDialogAbilityLoading && (
                                            <li className="relative flex flex-col items-center justify-center bg-[#211F46] border-2 border-tabuleiro rounded-lg h-60 w-44 animate-pulse">
                                                <div className="text-white font-bold text-md">
                                                    <FaSpinner className="animate-spin h-5 w-5 mx-auto" />
                                                </div>
                                            </li>
                                        )}
                                        <div onClick={() => setIsDialogCreateAbilityOpen(true)} className="flex border-dashed border-2 border-tabuleiro2 w-44 h-60 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/30 duration-150 cursor-pointer">
                                            <p className="text-tabuleiro2 text-3xl text-center font-bold">+</p>
                                        </div>
                                    </ul>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
            <div className="flex flex-col ml-48 mr-48">
                <h1 className="text-tabuleiro2 font-bold text-2xl mb-5">Inventário</h1>
                <div className='bg-tabuleiro/5 p-4 border-solid border-tabuleiro border-2 rounded-3xl'>
                    <p className=" text-center text-md font-bold text-tabuleiro2">Peso dos itens: {totalWeight}</p>
                    <p className='text-center text-xs'>(obs: no momento o peso total não leva em consideração a quantidade de itens)</p>
                    <div className='bg-tabuleiro/15 p-4 pb-4 rounded-xl'>
                        <ul className="grid grid-cols-7 gap-6">
                            {data?.inventory && data.inventory.length > 0 ? (
                                data.inventory.map((inventory, index) => (
                                    <li
                                        key={index}
                                        className="relative flex flex-col items-center justify-center bg-[#211F46] border-2 border-tabuleiro rounded-lg h-60 w-44 group"
                                    >
                                        {item_id === inventory.id && !isDialogDeleteItemOpen ? (
                                            <div className="flex flex-col items-center justify-center h-full w-full animate-pulse">
                                                <FaSpinner className="animate-spin h-8 w-8 text-white" />
                                                <p className="text-white mt-2">Deletando...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div
                                                    className="absolute -top-2 -right-2 z-30 bg-healthBar rounded-full p-1 shadow-md shadow-black/40 cursor-pointer mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                                    onClick={() => handleDeleteItemClick(inventory.id)}
                                                >
                                                    <FaRegTrashCan className="h-4 w-4 text-white" />
                                                </div>
                                                <div className='absolute top-0 bg-tabuleiro2 w-full rounded-t-lg text-center z-10'>
                                                    <p className="font-bold text-md pt-1">{inventory.item}</p>
                                                </div>
                                                <div className='flex flex-col gap-5'>
                                                    {inventory.diceqtd && inventory.dicenumber && (
                                                        <div className='flex justify-between pt-14'>
                                                            <p className="text-md font-bold mr-9 p-1">Dano</p>
                                                            <p className="text-md font-bold text-right bg-healthBar p-1 pl-2 pr-2 outline outline-2 outline-[#DF6565] rounded-md shadow-md shadow-black/50">
                                                                {inventory.diceqtd}d{inventory.dicenumber}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className='flex justify-between'>
                                                        <p className="text-md font-bold mr-9 p-1">Quantia</p>
                                                        <p className="text-md font-bold text-right p-1">{inventory.quantity}</p>
                                                    </div>
                                                    <div className='flex justify-between'>
                                                        <p className="text-md font-bold p-1 mb-8">Peso</p>
                                                        <p className="text-md font-bold text-right p-1">{Math.round(inventory.weight)}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <li>Nenhum item disponível</li>
                            )}
                            {isDialogItemLoading && (
                                <li className="relative flex flex-col items-center justify-center bg-[#211F46] border-2 border-tabuleiro rounded-lg h-60 w-44 animate-pulse">
                                    <div className="text-white font-bold text-md">
                                        <FaSpinner className="animate-spin h-5 w-5 mx-auto" />
                                    </div>
                                </li>
                            )}
                            <div onClick={() => setIsDialogCreateItemOpen(true)} className="flex border-dashed border-2 border-tabuleiro2 w-44 h-60 justify-center items-center rounded-lg shadow-md bg-none hover:bg-tabuleiro2/30 duration-150 cursor-pointer">
                                <p className="text-tabuleiro2 text-3xl text-center font-bold">+</p>
                            </div>
                        </ul>

                    </div>
                </div>
            </div>
        </div >
    );

}
